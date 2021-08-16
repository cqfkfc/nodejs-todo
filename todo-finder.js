const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()

const searchText = "TODO";

function checkFileForText(fileAbsolutePath) {
  fs.readFile(fileAbsolutePath, function (err, data) {
    if (err)
      console.error("An error occured at fs.readFile with message:", err);
    if (data.includes(searchText)) console.log(fileAbsolutePath);
  });
}

function checkNestedFiles(directoryAbsolutePath) {
  fs.readdir(directoryAbsolutePath, function (err, fileOrFolderPaths) {
    if (err)
      console.error("An error occured at fs.readdir with message: ", err);
    fileOrFolderPaths.forEach((fileOrFolderPath) => {
      const fullPath = path.join(directoryAbsolutePath, fileOrFolderPath);
      fs.stat(fullPath, function (err, stat) {
        if (err)
          console.error("An error occured at fs.stat with message:", err);
        if (stat.isDirectory()) checkNestedFiles(fullPath);
        if (stat.isFile()) {
          checkFileForText(fullPath);
        }
      });
    });
  });
}

checkNestedFiles(__dirname);
