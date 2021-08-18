const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()

var fileContainsText = async function (fileAbsolutePath, text) {
  const data = await fs.promises.readFile(fileAbsolutePath);
  return data.includes(text);
};

var getFilesInDirContainingText = async function (directoryAbsolutePath, text) {
  const filesOrFolders = await fs.promises.readdir(directoryAbsolutePath);
  const promises = Promise.all(
    filesOrFolders.map(async (filesOrFolders) => {
      const fullPath = path.join(directoryAbsolutePath, filesOrFolders);
      const fileStat = await fs.promises.stat(fullPath);
      if (fileStat.isDirectory()) {
        const nestedFilesResults = await getFilesInDirContainingText(
          fullPath,
          text
        ); // recursively check for nested files
        return nestedFilesResults;
      }
      if (fileStat.isFile()) {
        if (await fileContainsText(fullPath, text)) return fullPath;
        else return undefined;
      }
    })
  );

  const results = await promises;

  return results
    .filter(
      (file) => file !== undefined // files with no TODO string
    )
    .flat(Infinity);
};

const printFilesContainingText = async function (userDefinedDirectory, text) {
  let selectedDirectory = "./test/test_example";
  // defaults to test directory if path is not stated

  if (userDefinedDirectory !== undefined) {
    selectedDirectory = userDefinedDirectory;
  }
  const results = await getFilesInDirContainingText(selectedDirectory, text);

  console.log(results);
  if (userDefinedDirectory === undefined) {
    console.log("Results generated from test directory");
  } else {
    console.log("Results generated from: ", userDefinedDirectory);
  }
};

const userDefinedDirectory = process.argv[2];
printFilesContainingText(userDefinedDirectory, "TODO");

module.exports.getFilesInDirContainingText = getFilesInDirContainingText;
