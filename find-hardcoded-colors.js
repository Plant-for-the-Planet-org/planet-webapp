// find-hardcoded-colors.js
const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Color regex patterns to capture various color formats
const colorPatterns = [
  // HEX colors: #FFF, #FFFFFF
  /#([0-9A-Fa-f]{3}){1,2}\b/g,

  // RGB/RGBA colors: rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
  /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)/g,

  // HSL/HSLA colors: hsl(120, 100%, 50%), hsla(120, 100%, 50%, 0.3)
  /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/g,

  // Named colors (common ones)
  /\b(red|green|blue|yellow|purple|black|white|orange|pink|brown|gray|grey|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold)\b/gi,
];

// Color normalization functions
function normalizeHex(hex) {
  // Remove # if present
  hex = hex.toLowerCase().replace(/^#/, '');

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return hex;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return [r, g, b];
}

function parseRgb(rgbStr) {
  // Extract numbers from rgb/rgba string
  const numbers = rgbStr.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 3) return null;

  return [parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2])];
}

function normalizeColor(color) {
  // Convert to lowercase
  color = color.toLowerCase().trim();

  // HEX colors
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // RGB/RGBA colors
  if (color.startsWith('rgb')) {
    return parseRgb(color);
  }

  // Named colors (just a subset of common ones for demonstration)
  const namedColors = {
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    purple: [128, 0, 128],
    black: [0, 0, 0],
    white: [255, 255, 255],
    gray: [128, 128, 128],
    grey: [128, 128, 128],
    // Add more named colors as needed
  };

  if (namedColors[color]) {
    return namedColors[color];
  }

  // Return original color if no normalization rule applies
  return color;
}

// Function to generate a unique key for a color
function getColorKey(color) {
  const normalized = normalizeColor(color);
  if (Array.isArray(normalized)) {
    return `rgb-${normalized[0]}-${normalized[1]}-${normalized[2]}`;
  }
  return normalized;
}

// File extensions to search in
const extensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.html',
];

// Directories to exclude
const excludeDirs = ['node_modules', '.next', 'out', 'build', 'dist', '.git'];

// Mapping to store results
const results = {};

async function isDirectory(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

async function findColorsInFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const fileResults = { filePath, colors: [] };

    // Check each regex pattern for colors
    for (const pattern of colorPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          // Find the line number where the color appears
          const lines = content.split('\n');
          let lineNumber = 1;
          let foundLine = '';

          for (const line of lines) {
            // Use case-insensitive search to find the color in the line
            // but keep the original case in the results
            if (line.toLowerCase().includes(match.toLowerCase())) {
              foundLine = line.trim();
              break;
            }
            lineNumber++;
          }

          // Add to results if not already added
          const existingColor = fileResults.colors.find(
            (c) => c.color === match && c.line === lineNumber
          );
          if (!existingColor) {
            fileResults.colors.push({
              color: match,
              line: lineNumber,
              context: foundLine,
            });
          }
        }
      }
    }

    if (fileResults.colors.length > 0) {
      if (!results[filePath]) {
        results[filePath] = fileResults;
      } else {
        // Merge with existing results
        results[filePath].colors = [
          ...results[filePath].colors,
          ...fileResults.colors,
        ];
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

async function searchDirectory(dirPath, scriptFilePath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip the script file itself
      if (path.resolve(fullPath) === path.resolve(scriptFilePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          await searchDirectory(fullPath, scriptFilePath);
        }
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          await findColorsInFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dirPath}:`, error.message);
  }
}

async function findAllHardcodedColors(rootDir, outputFile, scriptPath) {
  console.log(`Starting search for hardcoded colors in: ${rootDir}\n`);
  console.log(`Excluding script file: ${scriptPath}`);
  await searchDirectory(rootDir, scriptPath);

  // Generate report content
  let reportContent = `# HARDCODED COLORS REPORT\n\n`;
  reportContent += `Project path: ${path.resolve(rootDir)}\n`;
  reportContent += `Date: ${new Date().toISOString()}\n\n`;
  reportContent += `## DETAILED FINDINGS\n\n`;

  let totalColors = 0;

  // Map to group equivalent colors
  const colorGroups = new Map();

  Object.keys(results).forEach((filePath) => {
    const fileResult = results[filePath];
    reportContent += `\nFile: ${fileResult.filePath}\n`;
    reportContent += '-'.repeat(filePath.length + 6) + '\n';

    fileResult.colors.forEach(({ color, line, context }) => {
      // Use bullet points for each finding to ensure proper line breaks in rendered Markdown
      reportContent += `- Line ${line}: ${color} in "${context}"\n`;
      console.log(`Found: ${filePath} - Line ${line}: ${color}`);

      // Group equivalent colors
      const colorKey = getColorKey(color);
      if (!colorGroups.has(colorKey)) {
        colorGroups.set(colorKey, new Set());
      }
      colorGroups.get(colorKey).add(color);

      totalColors++;
    });
  });

  reportContent += '\n## STATISTICS\n\n';
  reportContent += `Total files with hardcoded colors: ${
    Object.keys(results).length
  }\n`;
  reportContent += `Total hardcoded color instances: ${totalColors}\n`;
  reportContent += `Unique colors (normalized): ${colorGroups.size}\n\n`;

  // List all unique colors with their equivalent representations
  reportContent += '## UNIQUE COLORS WITH EQUIVALENT REPRESENTATIONS\n\n';

  // Sort color groups alphabetically by their first representation
  const sortedColorGroups = Array.from(colorGroups.entries()).sort((a, b) => {
    const aValues = Array.from(a[1]);
    const bValues = Array.from(b[1]);
    return aValues[0].localeCompare(bValues[0], undefined, {
      sensitivity: 'base',
    });
  });

  sortedColorGroups.forEach(([key, variants]) => {
    const variantList = Array.from(variants).sort().join(', ');
    reportContent += `- ${variantList}\n`;
  });

  // Save to file
  if (outputFile) {
    try {
      await writeFile(outputFile, reportContent);
      console.log(`\nReport saved to: ${outputFile}`);
    } catch (error) {
      console.error(`Error writing to output file: ${error.message}`);
    }
  }

  // Print summary to console
  console.log('\n=== HARDCODED COLORS SUMMARY ===');
  console.log(
    `Total files with hardcoded colors: ${Object.keys(results).length}`
  );
  console.log(`Total hardcoded color instances: ${totalColors}`);
  console.log(`Unique colors (normalized): ${colorGroups.size}`);

  return {
    fileCount: Object.keys(results).length,
    totalColors,
    uniqueColorGroups: colorGroups.size,
  };
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    projectPath: '.',
    outputFile: 'hardcoded-colors-report.md',
    scriptPath: process.argv[1], // Store the script path to exclude it
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' || args[i] === '-p') {
      if (i + 1 < args.length) options.projectPath = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      if (i + 1 < args.length) options.outputFile = args[++i];
    } else if (!args[i].startsWith('-')) {
      // Assume it's the project path if no flag is provided
      options.projectPath = args[i];
    }
  }

  return options;
}

// Example usage
const { projectPath, outputFile, scriptPath } = parseArgs();
console.log(`Scanning project: ${projectPath}`);
console.log(`Report will be saved to: ${outputFile}`);

findAllHardcodedColors(projectPath, outputFile, scriptPath)
  .then((stats) => {
    console.log('\nSearch completed!');
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
