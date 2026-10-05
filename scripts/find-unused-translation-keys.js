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

// Forward slashes, so the output reads the same on Windows.
function toDisplayPath(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

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
    let json;
    try {
      json = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));
    } catch (error) {
      throw new Error(`Could not parse ${file}: ${error.message}`);
    }
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

// Strips `(...)` and `as Type`, so t('key' as Key) still reads as 'key'.
function unwrapExpression(node) {
  while (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
    node = node.expression;
  }
  return node;
}

// The keys an argument can be when all of them are written out, e.g. t(isOpen ? 'close' : 'open').
function getLiteralKeys(node) {
  node = unwrapExpression(node);
  if (isStringNode(node)) return [node.text];
  if (ts.isConditionalExpression(node)) {
    const whenTrue = getLiteralKeys(node.whenTrue);
    const whenFalse = getLiteralKeys(node.whenFalse);
    if (whenTrue && whenFalse) return [...whenTrue, ...whenFalse];
  }
  return null;
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
    // A spread like { ...options } may hide the namespace.
    if (arg.properties.some(ts.isSpreadAssignment)) return null;
    // `.text` matches both namespace: 'NS' and 'namespace': 'NS'.
    const prop = arg.properties.find((p) => p.name?.text === 'namespace');
    // getTranslations({ locale }) has no namespace, so keys start from the root.
    if (!prop) return '';
    if (ts.isPropertyAssignment(prop) && isStringNode(prop.initializer)) {
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
      const arg = unwrapExpression(node.arguments[0]);
      const literalKeys = getLiteralKeys(arg);
      if (namespaces) {
        for (const ns of namespaces) {
          const prefix = ns ? `${ns}.` : '';
          if (literalKeys) {
            for (const key of literalKeys) result.staticKeys.add(prefix + key);
          } else if (ts.isTemplateExpression(arg)) {
            // t(`units.${type}`) becomes a pattern that matches every key under "units".
            result.dynamicPatterns.push(templateToPattern(arg, prefix, true));
          } else {
            // e.g. tMe(record.type), where the key comes from API data.
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart()
            );
            result.runtimeKeyCalls.push({
              namespace: ns,
              location: `${toDisplayPath(filePath)}:${line + 1}`,
            });
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
    runtimeKeyCalls: [],
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

  const runtimeCallsFor = (keys) =>
    [
      ...new Set(
        result.runtimeKeyCalls
          .filter(({ namespace }) =>
            keys.some((key) => !namespace || key.startsWith(`${namespace}.`))
          )
          .map(({ location }) => location)
      ),
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const printGrouped = (keys, { showRuntimeCalls = false } = {}) => {
    const byFile = new Map();
    for (const key of keys) {
      const file = keyToFile.get(key);
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push(key);
    }
    const groups = [...byFile].sort(([a], [b]) => a.localeCompare(b));
    for (const [file, fileKeys] of groups) {
      console.log(`\n  ${file} (${fileKeys.length})`);
      const runtimeCalls = showRuntimeCalls ? runtimeCallsFor(fileKeys) : [];
      if (runtimeCalls.length > 0) {
        console.log(
          '    ! This namespace is also called with keys picked at runtime, so some of these may be used:'
        );
        for (const location of runtimeCalls) console.log(`      ${location}`);
      }
      for (const key of fileKeys.sort()) console.log(`    ${key}`);
    }
  };

  console.log(
    `Scanned ${keyToFile.size} keys in ${toDisplayPath(LOCALES_DIR)} against ${
      sourceFiles.length
    } source files.`
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
  printGrouped(unused, { showRuntimeCalls: true });

  console.log(`\nKeys found only as a plain string: ${onlyAsString.length}`);
  console.log('Likely passed to t() through a variable, so probably used.');
  if (verbose) {
    printGrouped(onlyAsString);
  } else {
    console.log('Run with -- --verbose to list them.');
  }
}

main();
