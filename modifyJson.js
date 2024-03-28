/**
 * Modifies JSON files in a specified directory by converting the file names to PascalCase
 * and updating the file contents with the modified JSON data.
 * @param {string} directoryPath - The path to the directory containing the JSON files.
 */
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public/static/locales/pt-BR');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const rawData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(rawData);

    const fileNameWithoutExtension = path.basename(file, '.json');
    const pascalCaseFileName = fileNameWithoutExtension
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const newData = {
      [pascalCaseFileName]: jsonData,
    };

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  });
});
