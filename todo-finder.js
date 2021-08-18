const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()

const searchText = "TODO";

var fileContainsText = async function (fileAbsolutePath) {
  const data = await fs.promises.readFile(fileAbsolutePath);
  return data.includes(searchText);
};

var checkNestedFilesForText = async function (directoryAbsolutePath) {
  const filesOrFolders = await fs.promises.readdir(directoryAbsolutePath);
  const epoches = Promise.all(
    filesOrFolders.map(async (filesOrFolders) => {
      const fullPath = path.join(directoryAbsolutePath, filesOrFolders);
      const fileStat = await fs.promises.stat(fullPath);
      if (fileStat.isDirectory()) {
        const nestedFilesResults = await checkNestedFilesForText(fullPath);
        return nestedFilesResults;
      }
      if (fileStat.isFile()) {
        if (await fileContainsText(fullPath)) return fullPath;
        else return undefined;
      }
    })
  );

  const results = await epoches;

  return results
    .filter(
      (file) => file !== undefined // files with no TODO string
    )
    .flat(Infinity);
};

const getFilesWithTODO = async function (userInput) {
  let selectedDirectory = "./test/test_example";
  // defaults to test directory if path is not stated

  if (userInput !== undefined) {
    selectedDirectory = userInput;
  }
  const results = await checkNestedFilesForText(selectedDirectory);

  console.log(results);
  if (userInput === undefined) {
    console.log(
      "Results generated from test directory when no path is defined. "
    );
  } else {
    console.log("Results generated from: ", userInput);
  }
};

const userInput = process.argv[2];
getFilesWithTODO(userInput);

module.exports.checkNestedFilesForText = checkNestedFilesForText;
