const fs = require('fs');
const path = require('path');

function crawlFolderStructure(rootDir) {
  const files = [];
  function crawlDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        crawlDirectory(itemPath); // Recursive call for subdirectories
      } else {
        files.push(`/${path.relative(rootDir, itemPath).replace(/\[.*?\]/g, ':path').replace(/\/?index\.tsx?$/, '').replace(/\.tsx?$/, '')}`); // Add modified file path to the array
      }
    }
  }
  try {
    crawlDirectory(rootDir);
    return files;
  } catch (error) {
    console.error('Error while crawling:', error.message);
    return [];
  }
}

const scriptDir = __dirname;
const rootPath = path.join(scriptDir, 'pages');
const fileList = crawlFolderStructure(rootPath);
console.log(fileList);