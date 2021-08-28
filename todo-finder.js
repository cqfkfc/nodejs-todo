const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()

var fileContainsText = function (data, text, caseSensitive) {
  if (caseSensitive) {
    return data.toString().toLowerCase().includes(text.toLowerCase());
  }
  return data.includes(text);
};

var getFileStringCount = function (fileBuffer, text, caseSensitive) {
  const dataString = fileBuffer.toString();

  if (caseSensitive) {
    return (numOccurences = dataString.split(text).length - 1);
  } else {
    return dataString.toLowerCase().split(text.toLowerCase()).length - 1;
  }
};

var getAllFilesFromDirectory = async function (directoryAbsolutePath) {
  const dirStat = await fs.promises.stat(directoryAbsolutePath);
  if (dirStat.isFile()) {
    throw new Error("Input should be a directory instead of file.");
  }

  const filesOrFolders = await fs.promises.readdir(directoryAbsolutePath);

  const promises = Promise.all(
    filesOrFolders.map(async (filesOrFolders) => {
      const fullPath = path.join(directoryAbsolutePath, filesOrFolders);
      const fileStat = await fs.promises.stat(fullPath);
      if (fileStat.isDirectory()) {
        // recursively check for nested files
        return await getAllFilesFromDirectory(fullPath);
      }
      // if fileStat.isFile()
      return {
        filepath: fullPath,
        data: await fs.promises.readFile(fullPath),
      };
    })
  );

  return (await promises)
    .filter(
      (file) => file !== undefined // files with no TODO string
    )
    .flat(Infinity);
};

var run = async function (testPathAbsolute, text) {
  const files = await getAllFilesFromDirectory(testPathAbsolute);
  const results = await Promise.all(
    files.map(async (file) => ({
      filepath: path.relative(testPathAbsolute, file.filepath),
      containsText: fileContainsText(file.data, text, (caseSensitive = false)),
    }))
  );

  const resultsClean = results
    .filter((file) => file.containsText === true)
    .map((file) => file.filepath);

  console.log(resultsClean);
};

function convertUserInputToAbsolutePath(userInput) {
  const testPath = "/test/test_example";
  const absolutepath =
    userInput === undefined
      ? path.join(__dirname, testPath)
      : path.join(__dirname, userInput);
  return absolutepath;
}

const absPath = convertUserInputToAbsolutePath(process.argv[2]);
run(absPath, "TODO");
module.exports.getAllFilesFromDirectory = getAllFilesFromDirectory;
module.exports.getFileStringCount = getFileStringCount;
module.exports.fileContainsText = fileContainsText;
