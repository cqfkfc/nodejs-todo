const path = require("path");
const fs = require("graceful-fs"); // to prevent open too many files error at fs.readFile()
const yargs = require("yargs");

const argv = yargs
  .command("lyr", "Outputs file paths that contain TODO text", {
    year: {
      description: "the year to check for",
      alias: "y",
      type: "number",
    },
  })
  .option("caseSensitive", {
    alias: "cs",
    description: "Search Text is case sensitive",
    type: "boolean",
  })
  .option("count", {
    alias: "c",
    description: "Also returns the number of occurrence in text",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

var getFileContainsText = function (data, text, caseSensitive) {
  if (caseSensitive) {
    return data.includes(text);
  }
  return data.toString().toLowerCase().includes(text.toLowerCase());
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

var run = async function (
  testPathAbsolute,
  text,
  caseSensitive,
  returnCountString
) {
  const files = await getAllFilesFromDirectory(testPathAbsolute);
  const results = await Promise.all(
    files.map(async (file) => ({
      filepath: path.relative(testPathAbsolute, file.filepath),
      value: returnCountString
        ? getFileStringCount(file.data, text, (caseSensitive = caseSensitive))
        : getFileContainsText(file.data, text, (caseSensitive = caseSensitive)),
    }))
  );
  if (returnCountString) {
    const resultsClean = results.filter((file) => file.value > 0);
    console.log(resultsClean);
  } else {
    const resultsClean = results
      .filter((file) => file.value === true)
      .map((file) => file.filepath);
    console.log(resultsClean);
  }
};

run(
  path.join(__dirname, process.argv[2] || ""),
  "todo",
  argv.caseSensitive,
  argv.count
);
module.exports.getAllFilesFromDirectory = getAllFilesFromDirectory;
module.exports.getFileStringCount = getFileStringCount;
module.exports.getFileContainsText = getFileContainsText;
