import fs from 'fs';
import path from 'path';

const directoryToScan = './src';
const reportFile = './dynamic-classnames-report.md';

// Regex patterns to detect dynamic className logic (multi-line safe)
const patterns = [
  //  Inline JSX ternary
  /className\s*=\s*{[^}]*\?[^:}]+:[^}]+}/g,

  //  Inline JSX template literal
  /className\s*=\s*{`[^`]*\$\{[^}]+}[^`]*`}/g,

  //  Variables using `styles.` and ternary operator
  /const\s+[A-Za-z0-9_]+\s*=\s*[^;]*styles\.[^;]*\?[^;:]+:[^;]+;/g,

  // Variables using `styles.` and template literals
  /const\s+[A-Za-z0-9_]+\s*=\s*`[^`]*styles\.[^`]*\$\{[^}]+}[^`]*`/g,
];

let totalFilesScanned = 0;
let totalMatches = 0;
let matchedFiles = [];

function getLineNumber(content, matchIndex) {
  // Count how many newlines before this match
  return content.substring(0, matchIndex).split('\n').length;
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      totalFilesScanned++;
      const content = fs.readFileSync(fullPath, 'utf8');
      let fileMatches = [];

      patterns.forEach((regex) => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const snippet = match[0].trim().slice(0, 250);
          const lineNumber = getLineNumber(content, match.index);
          totalMatches++;
          fileMatches.push({ line: lineNumber, snippet });
        }
      });

      if (fileMatches.length > 0) {
        matchedFiles.push({ file: fullPath, matches: fileMatches });
      }
    }
  }
}

function generateMarkdownReport() {
  let report = `# 🧾 Dynamic Classname Logic Report\n\n`;
  report += `**Scanned Directory:** \`${directoryToScan}\`\n\n`;
  report += `- **Total Files Scanned:** ${totalFilesScanned}\n`;
  report += `- **Files with Matches:** ${matchedFiles.length}\n`;
  report += `- **Total Matches Found:** ${totalMatches}\n\n`;
  report += `---\n\n`;

  matchedFiles.forEach(({ file, matches }) => {
    report += `### 📄 File: \`${file}\`\n\n`;
    matches.forEach(({ line, snippet }, i) => {
      report += `**Match ${i + 1} (Line ${line}):**\n`;
      report += '```tsx\n';
      report += `${snippet}\n`;
      report += '```\n\n';
    });
    report += `---\n\n`;
  });

  fs.writeFileSync(reportFile, report, 'utf8');
  console.log(`✅ Markdown report saved to: ${reportFile}`);
}

console.log('🔍 Scanning for dynamic className logic...');
scanDirectory(directoryToScan);
generateMarkdownReport();
