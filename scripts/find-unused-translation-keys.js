#!/usr/bin/env node

// Lists next-intl keys in the English locale files that no code seems to use.
// Read-only: it never changes any translation file.
// Usage: npm run find-unused-translation-keys [-- --verbose]

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'public/static/locales/en');
const SOURCE_DIRS = ['src', 'pages'];
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const TRANSLATOR_FACTORIES = ['useTranslations', 'getTranslations'];
const TRANSLATOR_METHODS = ['rich', 'markup', 'raw', 'has'];
// Keys picked at runtime, so a code scan can't see them. Country keys come from src/utils/constants/countries.ts via code.toLowerCase().
const SKIPPED_PREFIXES = ['Country.'];

const verbose = process.argv.includes('--verbose');

function flattenKeys(obj, prefix, out) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      flattenKeys(value, fullKey, out);
    } else {
      out.push(fullKey);
    }
  }
  return out;
}

function loadTranslationKeys() {
  const keyToFile = new Map();
  for (const file of fs
    .readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith('.json'))) {
    const json = JSON.parse(
      fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8')
    );
    for (const key of flattenKeys(json, '', [])) keyToFile.set(key, file);
  }
  return keyToFile;
}

function listSourceFiles() {
  return SOURCE_DIRS.flatMap((dir) =>
    fs
      .readdirSync(path.join(ROOT, dir), {
        recursive: true,
        withFileTypes: true,
      })
      .filter(
        (entry) =>
          entry.isFile() && SOURCE_EXTENSIONS.includes(path.extname(entry.name))
      )
      .map((entry) => path.join(entry.parentPath, entry.name))
  );
}

function isStringNode(node) {
  return (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
  );
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Turns `${name}Required` into /^.+Required$/. Returns null for templates with too little fixed text to be a key, unless forced.
function templateToPattern(node, prefix = '', force = false) {
  const fixedParts = [
    node.head.text,
    ...node.templateSpans.map((span) => span.literal.text),
  ];
  const fixedText = fixedParts.join('');
  if (
    !force &&
    (fixedText.replace(/\./g, '').length < 3 || /\s/.test(fixedText))
  )
    return null;
  const pattern =
    escapeRegex(prefix + node.head.text) +
    node.templateSpans
      .map((span) => '.+' + escapeRegex(span.literal.text))
      .join('');
  return new RegExp(`^${pattern}$`);
}

// Reads the namespace from useTranslations('NS') or getTranslations({ namespace: 'NS' }).
function getNamespace(call) {
  const arg = call.arguments[0];
  if (!arg) return '';
  if (isStringNode(arg)) return arg.text;
  if (ts.isObjectLiteralExpression(arg)) {
    const prop = arg.properties.find(
      (p) => p.name && p.name.getText() === 'namespace'
    );
    if (
      prop &&
      ts.isPropertyAssignment(prop) &&
      isStringNode(prop.initializer)
    ) {
      return prop.initializer.text;
    }
  }
  return null;
}

function scanFile(filePath, result) {
  const content = fs.readFileSync(filePath, 'utf8');
  // .ts files use TS so `<Type>value` casts still parse; everything else may contain JSX.
  const kind = filePath.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.TSX;
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    kind
  );

  // Translator variable name -> namespaces. A Set, because one file can reuse `t` for different namespaces.
  const translators = new Map();
  const findTranslators = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      let init = node.initializer;
      if (ts.isAwaitExpression(init)) init = init.expression;
      if (
        ts.isCallExpression(init) &&
        ts.isIdentifier(init.expression) &&
        TRANSLATOR_FACTORIES.includes(init.expression.text)
      ) {
        const namespace = getNamespace(init);
        if (namespace !== null) {
          if (!translators.has(node.name.text))
            translators.set(node.name.text, new Set());
          translators.get(node.name.text).add(namespace);
        }
      }
    }
    ts.forEachChild(node, findTranslators);
  };
  findTranslators(sourceFile);

  const getCallNamespaces = (callee) => {
    if (ts.isIdentifier(callee)) return translators.get(callee.text);
    if (
      ts.isPropertyAccessExpression(callee) &&
      ts.isIdentifier(callee.expression) &&
      TRANSLATOR_METHODS.includes(callee.name.text)
    ) {
      return translators.get(callee.expression.text);
    }
    return undefined;
  };

  const visit = (node) => {
    if (isStringNode(node)) result.literals.add(node.text);
    if (ts.isTemplateExpression(node)) {
      const pattern = templateToPattern(node);
      if (pattern) result.literalPatterns.push(pattern);
    }

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const namespaces = getCallNamespaces(node.expression);
      const arg = node.arguments[0];
      if (namespaces) {
        for (const ns of namespaces) {
          const prefix = ns ? `${ns}.` : '';
          if (isStringNode(arg)) {
            result.staticKeys.add(prefix + arg.text);
          } else if (ts.isTemplateExpression(arg)) {
            // t(`units.${type}`) becomes a pattern that matches every key under "units".
            result.dynamicPatterns.push(templateToPattern(arg, prefix, true));
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

// "a.b.c" -> ["a.b.c", "b.c", "c"]
function dottedSuffixes(key) {
  const parts = key.split('.');
  return parts.map((_, i) => parts.slice(i).join('.'));
}

function main() {
  const keyToFile = loadTranslationKeys();
  const sourceFiles = listSourceFiles();
  const result = {
    staticKeys: new Set(),
    dynamicPatterns: [],
    literals: new Set(),
    literalPatterns: [],
  };
  for (const file of sourceFiles) scanFile(file, result);

  const unused = [];
  const onlyAsString = [];
  let skipped = 0;
  for (const key of keyToFile.keys()) {
    if (SKIPPED_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      skipped++;
      continue;
    }
    // Also counts a parent key, e.g. t.raw('list') uses every key under "list".
    const usedStatically = key
      .split('.')
      .some((_, i, parts) =>
        result.staticKeys.has(parts.slice(0, i + 1).join('.'))
      );
    if (usedStatically) continue;
    if (result.dynamicPatterns.some((pattern) => pattern.test(key))) continue;
    const suffixes = dottedSuffixes(key);
    if (
      suffixes.some(
        (suffix) =>
          result.literals.has(suffix) ||
          result.literalPatterns.some((pattern) => pattern.test(suffix))
      )
    ) {
      onlyAsString.push(key);
      continue;
    }
    unused.push(key);
  }

  const printGrouped = (keys) => {
    const byFile = new Map();
    for (const key of keys) {
      const file = keyToFile.get(key);
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push(key);
    }
    for (const [file, fileKeys] of [...byFile].sort()) {
      console.log(`\n  ${file} (${fileKeys.length})`);
      for (const key of fileKeys.sort()) console.log(`    ${key}`);
    }
  };

  console.log(
    `Scanned ${keyToFile.size} keys in ${path.relative(
      ROOT,
      LOCALES_DIR
    )} against ${sourceFiles.length} source files.`
  );
  console.log(
    `Skipped ${skipped} keys under ${SKIPPED_PREFIXES.join(
      ', '
    )} (chosen at runtime).`
  );

  console.log(`\nUnused keys: ${unused.length}`);
  console.log(
    'No reference found in code. Review before removing, the value may come from an API or config.'
  );
  printGrouped(unused);

  console.log(`\nKeys found only as a plain string: ${onlyAsString.length}`);
  console.log('Likely passed to t() through a variable, so probably used.');
  if (verbose) {
    printGrouped(onlyAsString);
  } else {
    console.log('Run with -- --verbose to list them.');
  }
}

main();
