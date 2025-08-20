#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const OUTPUT_FILE = 'reports/css-module-analysis-report.md';

console.log('🔍 Analyzing CSS module usage across the entire project...');

// Helper functions
function getLineNumber(content, searchStringOrIndex) {
  if (typeof searchStringOrIndex === 'number') {
    // If it's an index number
    return content.substring(0, searchStringOrIndex).split('\n').length;
  }

  // If it's a search string, find its position
  const index = content.indexOf(searchStringOrIndex);
  if (index === -1) return 1;
  return content.substring(0, index).split('\n').length;
}

function extractCSSClasses(cssContent) {
  const classes = new Set();

  // Remove comments and strings to avoid false positives
  const cleanContent = cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/@import\s+[^;]+;/g, '') // Remove @import statements
    .replace(/@keyframes\s+[^{]+\{[^}]*\}/g, ''); // Remove @keyframes

  // Find regular CSS classes (.className)
  const directClasses = [
    ...cleanContent.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g),
  ];
  directClasses.forEach(([, className]) => {
    // Exclude pseudo-classes and states
    if (!className.includes(':') && !className.startsWith('-')) {
      classes.add(className);
    }
  });

  // Handle SCSS nested BEM classes
  const lines = cleanContent.split('\n');
  let currentParents = [];
  let braceLevel = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Count braces to track nesting level
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;

    // Handle closing braces first
    for (let i = 0; i < closeBraces; i++) {
      if (braceLevel > 0) {
        braceLevel--;
        if (currentParents.length > 0) {
          currentParents.pop();
        }
      }
    }

    // Main class definition
    const mainClassMatch = trimmed.match(/^\.([a-zA-Z_][a-zA-Z0-9_-]*)/);
    if (mainClassMatch) {
      const className = mainClassMatch[1];
      classes.add(className);

      if (openBraces > 0) {
        currentParents.push(className);
        braceLevel++;
      }
    }

    // BEM nested selectors (&__)
    const bemElementMatch = trimmed.match(/^&(__[a-zA-Z0-9_-]+)/);
    if (bemElementMatch && currentParents.length > 0) {
      const element = bemElementMatch[1];
      const fullClass = currentParents[currentParents.length - 1] + element;
      classes.add(fullClass);

      if (openBraces > 0) {
        currentParents.push(fullClass);
        braceLevel++;
      }
    }

    // BEM nested modifiers (&--)
    const bemModifierMatch = trimmed.match(/^&(--[a-zA-Z0-9_-]+)/);
    if (bemModifierMatch && currentParents.length > 0) {
      const modifier = bemModifierMatch[1];
      const fullClass = currentParents[currentParents.length - 1] + modifier;
      classes.add(fullClass);

      if (openBraces > 0) {
        currentParents.push(fullClass);
        braceLevel++;
      }
    }

    // Other nested selectors (&.className, &ClassName, etc.)
    const nestedMatch = trimmed.match(/^&\.?([a-zA-Z_][a-zA-Z0-9_-]*)/);
    if (
      nestedMatch &&
      currentParents.length > 0 &&
      !bemElementMatch &&
      !bemModifierMatch
    ) {
      const nestedClass = nestedMatch[1];
      // For &.className, add as separate class
      // For &className, combine with parent
      if (trimmed.startsWith('&.')) {
        classes.add(nestedClass);
      } else {
        const combinedClass =
          currentParents[currentParents.length - 1] + nestedClass;
        classes.add(combinedClass);
      }

      if (openBraces > 0) {
        currentParents.push(nestedClass);
        braceLevel++;
      }
    }

    // Nested class selectors (.className inside parent)
    const nestedClassMatch = trimmed.match(/^\.([a-zA-Z_][a-zA-Z0-9_-]*)/);
    if (nestedClassMatch && currentParents.length > 0 && !mainClassMatch) {
      const nestedClassName = nestedClassMatch[1];
      classes.add(nestedClassName);

      if (openBraces > 0) {
        currentParents.push(nestedClassName);
        braceLevel++;
      }
    }

    // Handle opening braces for non-class selectors
    if (
      openBraces > 0 &&
      !mainClassMatch &&
      !bemElementMatch &&
      !bemModifierMatch
    ) {
      braceLevel += openBraces;
    }
  });

  return Array.from(classes).sort();
}

const errors = [];
const warnings = [];
const stats = {
  totalTsFiles: 0,
  totalCssFiles: 0,
  filesWithCssImports: 0,
  totalClassUsages: 0,
  errorCount: 0,
  warningCount: 0,
};

// Find all TypeScript files
const tsFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.d.ts', '**/node_modules/**', '**/*.test.*', '**/*.spec.*'],
});

// Find all CSS module files
const cssFiles = glob.sync('src/**/*.module.{css,scss,sass}');

stats.totalTsFiles = tsFiles.length;
stats.totalCssFiles = cssFiles.length;

console.log(
  `📊 Found ${tsFiles.length} TypeScript files and ${cssFiles.length} CSS module files`
);

// Process each TypeScript file
tsFiles.forEach((tsFile) => {
  try {
    const content = fs.readFileSync(tsFile, 'utf8');

    // Find CSS module imports
    const importRegex =
      /import\s+(\w+)\s+from\s+['"](.*\.module\.(css|scss|sass))['"];?/g;
    const imports = [...content.matchAll(importRegex)];

    if (imports.length > 0) {
      stats.filesWithCssImports++;
    }

    imports.forEach((importMatch) => {
      const [_fullImport, importName, cssPath, _extension] = importMatch;

      // Resolve CSS file path
      const tsDir = path.dirname(tsFile);
      const fullCssPath = path.resolve(tsDir, cssPath);
      const relativeTs = path.relative(process.cwd(), tsFile);
      const relativeCss = path.relative(process.cwd(), fullCssPath);

      // Check if CSS file exists
      if (!fs.existsSync(fullCssPath)) {
        errors.push({
          type: 'missing-css-file',
          file: relativeTs,
          line: getLineNumber(content, importMatch.index),
          message: `CSS module file not found: ${cssPath}`,
          cssFile: relativeCss,
        });
        stats.errorCount++;
        return; // Skip this import and continue to next one
      }

      // Parse CSS file for available classes
      const cssContent = fs.readFileSync(fullCssPath, 'utf8');
      const availableClasses = extractCSSClasses(cssContent);

      // Remove import statements to avoid false positives
      // Use a more specific regex to avoid removing similar patterns
      const importStatementRegex = new RegExp(
        `import\\s+${importName}\\s+from\\s+['"](.*\\.module\\.(css|scss|sass))['"];?`,
        'g'
      );
      const contentWithoutImports = content.replace(
        importStatementRegex,
        (match) => {
          return ' '.repeat(match.length);
        }
      );

      const usageRegex = new RegExp(
        `${importName}\\.(\\w+)|${importName}\\[['"\`]([^'"\`]+)['"\`]\\]`,
        'g'
      );
      const usages = [...contentWithoutImports.matchAll(usageRegex)];

      stats.totalClassUsages += usages.length;

      // Track seen errors to prevent duplicates
      const seenErrors = new Set();

      usages.forEach((usageMatch) => {
        const [fullUsage, dotNotation, bracketNotation] = usageMatch;
        const className = dotNotation || bracketNotation;

        if (className) {
          // Check if this is a dynamic class name (template literal with interpolation)
          const isDynamicClass =
            fullUsage.includes('`') ||
            fullUsage.includes('${') ||
            className.includes('${');

          if (isDynamicClass) {
            // Flag dynamic class names as warnings
            const line = getLineNumber(content, usageMatch.index);
            const warningKey = `${relativeTs}|${className}|${line}`;

            if (!seenErrors.has(warningKey)) {
              seenErrors.add(warningKey);
              warnings.push({
                type: 'dynamic-class',
                file: relativeTs,
                line: line,
                message: `Dynamic class name '${className}' cannot be statically verified`,
                className,
                cssFile: relativeCss,
                importName,
              });
              stats.warningCount++;
            }
          } else if (!availableClasses.includes(className)) {
            // Regular undefined class error
            const line = getLineNumber(content, usageMatch.index);
            const errorKey = `${relativeTs}|${className}|${line}`;

            if (!seenErrors.has(errorKey)) {
              seenErrors.add(errorKey);
              errors.push({
                type: 'undefined-class',
                file: relativeTs,
                line: line,
                message: `Class '${className}' does not exist in ${path.basename(
                  fullCssPath
                )}`,
                className,
                cssFile: relativeCss,
                importName,
              });
              stats.errorCount++;
            }
          }
        }
      });

      // Note: Unused class detection removed as it generates too many false positives
      // with shared CSS modules and utility classes
    });
  } catch (error) {
    console.warn(`⚠️  Error processing ${tsFile}: ${error.message}`);
  }
});

// Generate report
console.log('\n📋 Generating analysis report...');

let report = `# CSS Module Analysis Report

Generated: ${new Date().toLocaleString()}

## Summary Statistics

- **TypeScript files processed**: ${stats.totalTsFiles}
- **CSS module files found**: ${stats.totalCssFiles}
- **Files with CSS imports**: ${stats.filesWithCssImports}
- **Total CSS class usages**: ${stats.totalClassUsages}
- **Errors found**: ${stats.errorCount}
- **Warnings**: ${stats.warningCount}

---

`;

if (errors.length === 0 && warnings.length === 0) {
  report += `## 🎉 No Issues Found!

Your CSS modules are properly configured and all classes are correctly defined.

### What this means:

- All CSS classes being used exist in their respective CSS files
- No missing CSS module files
- No obvious typos in class names

Great job maintaining clean CSS module usage!

---

`;
} else {
  if (errors.length > 0) {
    report += `## ❌ Errors Found (${errors.length})

These issues need to be fixed:

---

`;

    // Group errors by type
    const errorsByType = errors.reduce((acc, error) => {
      if (!acc[error.type]) acc[error.type] = [];
      acc[error.type].push(error);
      return acc;
    }, {});

    Object.entries(errorsByType).forEach(([type, typeErrors]) => {
      report += `### ${
        type === 'undefined-class'
          ? 'Undefined CSS Classes'
          : 'Missing CSS Files'
      }\n\n`;

      typeErrors.forEach((error, index) => {
        // Use plain text paths with consistent formatting
        const itemNumber = (index + 1).toString().padStart(2, ' ');
        report += `${itemNumber}. **File:** \`${error.file}:${error.line}\`\n\n`;
        report += `    **Error:** ${error.message}\n\n`;

        if (error.cssFile && type === 'undefined-class') {
          report += `    **CSS file:** \`${error.cssFile}\`\n\n`;
        }

        report += `---\n\n`;
      });
    });
  }

  if (warnings.length > 0) {
    report += `## ⚠️ Warnings (${warnings.length})

These don't break functionality but may need attention:

---

`;

    // Group warnings by type
    const warningsByType = warnings.reduce((acc, warning) => {
      if (!acc[warning.type]) acc[warning.type] = [];
      acc[warning.type].push(warning);
      return acc;
    }, {});

    Object.entries(warningsByType).forEach(([type, typeWarnings]) => {
      report += `### ${
        type === 'dynamic-class' ? 'Dynamic CSS Classes' : 'Other Warnings'
      }\n\n`;

      typeWarnings.slice(0, 20).forEach((warning, index) => {
        const itemNumber = (index + 1).toString().padStart(2, ' ');
        report += `${itemNumber}. **File:** \`${warning.file}:${warning.line}\`\n\n`;
        report += `    **Warning:** ${warning.message}\n\n`;

        if (warning.cssFile) {
          report += `    **CSS file:** \`${warning.cssFile}\`\n\n`;
        }

        report += `---\n\n`;
      });

      if (typeWarnings.length > 20) {
        report += `... and ${
          typeWarnings.length - 20
        } more ${type} warnings\n\n`;
      }
    });
  }

  report += `## 🔧 How to Fix

### For Undefined Classes:

1. **Add missing CSS class** to the CSS file
2. **Fix typos** in class names
3. **Check import paths** are correct

### For Missing CSS Files:

1. **Create the missing CSS file**
2. **Update the import path**
3. **Move CSS files** to correct location

### For Dynamic Class Warnings:

1. **Verify with TypeScript plugin** - Use typescript-plugin-css-modules for type checking
2. **Ensure all possible class names exist** in the CSS file
3. **Consider using conditional logic** instead of template literals when possible
4. **Test runtime behavior** to ensure classes resolve correctly

### For Other Warnings:

1. **Remove unused CSS classes** if they're truly not needed
2. **Consider if classes are used elsewhere** in the project
3. **Keep utility classes** that might be used later

---

`;
}

report += `---
*Generated by CSS Module Static Analyzer*
`;

// Write report to file
const reportDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}
fs.writeFileSync(OUTPUT_FILE, report);

// Console summary
console.log(`\n📊 Analysis Complete!`);
console.log(`   Errors: ${stats.errorCount}`);
console.log(`   Warnings: ${stats.warningCount}`);
console.log(`   Report saved to: ${OUTPUT_FILE}`);

if (stats.errorCount > 0) {
  console.log(`\n🚨 Found ${stats.errorCount} errors that need attention`);
  process.exit(1);
} else {
  console.log(`\n✅ No critical errors found`);
  process.exit(0);
}
