const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()

var fileContainsText = async function (fileAbsolutePath, text) {
  const data = await fs.promises.readFile(fileAbsolutePath);
  return data.includes(text);
};

var getFilesContainingText = async function (directoryAbsolutePath, text) {
  // this return all files that contain the defined text, in the directory
  const filesOrFolders = await fs.promises.readdir(directoryAbsolutePath);
  const promises = Promise.all(
    filesOrFolders.map(async (filesOrFolders) => {
      const fullPath = path.join(directoryAbsolutePath, filesOrFolders);
      const fileStat = await fs.promises.stat(fullPath);
      if (fileStat.isDirectory()) {
        const nestedFilesResults = await getFilesContainingText(fullPath, text); // recursively check for nested files
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
  const testDirectory = "./test/test_example";

  const searchDirectory =
    userDefinedDirectory === undefined ? testDirectory : userDefinedDirectory;

  const results = await getFilesContainingText(searchDirectory, text);

  console.log(results);
  console.log("Results generated from: ", searchDirectory);
};

const userDefinedDirectory = process.argv[2];
printFilesContainingText(userDefinedDirectory, "TODO");

module.exports.getFilesContainingText = getFilesContainingText;
