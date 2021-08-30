var expect = require("chai").expect;
const path = require("path");

const {
  getAllFilesFromDirectory,
  getFileStringCount,
  getFileContainsText,
} = require("../todo-finder");

describe("search todo in directory", () => {
  it("if path is a file and not a directory, should throw error", async () => {
    const testDir = "./test_example/somedir/somemodule/somefile.js";
    const testPathAbsolute = path.join(__dirname, testDir);

    await getAllFilesFromDirectory(testPathAbsolute).catch((err) => {
      expect(err).to.be.an("error");
    });
  });

  it("output file paths that contains TODO text (case-sensitive)", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const expectedOutput = [
      "somedir\\somemodule\\somefile.js",
      "somedir\\somemodule\\someotherfile.js",
      "somedir2\\anotherdir\\index.js",
      "somedir2\\anotherdir\\yet_another_dir\\index.js",
      "somedir2\\index.js",
      "somedir3\\another_file.js",
      "somefile.js",
    ];

    const files = await getAllFilesFromDirectory(testPathAbsolute);
    const results = await Promise.all(
      files.map(async (file) => ({
        filepath: path.relative(testPathAbsolute, file.filepath),
        value: getFileContainsText(file.data, "TODO", (caseSensitive = true)),
      }))
    );

    const resultsClean = results
      .filter((file) => file.value === true)
      .map((file) => file.filepath);

    // there should only be 6 files
    expect(resultsClean.length).to.equal(7);

    expect(resultsClean).to.eql(expectedOutput);
  });

  it("output file paths that contains todo text (not case-sensitive) ", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const expectedOutput = [
      "somedir\\somemodule\\somefile.js",
      "somedir\\somemodule\\someotherfile.js",
      "somedir2\\anotherdir\\index.js",
      "somedir2\\anotherdir\\yet_another_dir\\index.js",
      "somedir2\\index.js",
      "somedir3\\another_file.js",
      "somefile.js",
    ];

    const files = await getAllFilesFromDirectory(testPathAbsolute);
    const results = await Promise.all(
      files.map(async (file) => ({
        filepath: path.relative(testPathAbsolute, file.filepath),
        value: getFileContainsText(file.data, "todo", (caseSensitive = false)),
      }))
    );

    const resultsClean = results
      .filter((file) => file.value === true)
      .map((file) => file.filepath);

    expect(resultsClean.length).to.equal(7);

    expect(resultsClean).to.eql(expectedOutput);
  });

  it("output file paths that contains a text that doesnt exist", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const files = await getAllFilesFromDirectory(testPathAbsolute);
    const results = await Promise.all(
      files.map(async (file) => ({
        filepath: path.relative(testPathAbsolute, file.filepath),
        value: getFileContainsText(
          file.data,
          "thisTextThatDoesntExist",
          (caseSensitive = true)
        ),
      }))
    );

    const resultsClean = results
      .filter((file) => file.containsText === true)
      .map((file) => file.filepath);

    // there should be no files
    expect(resultsClean.length).to.equal(0);
  });

  it("get count of string when text is not case-sensitive e.g. todo should catch TODO", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const files = await getAllFilesFromDirectory(testPathAbsolute);
    const results = await Promise.all(
      files.map(async (file) => ({
        filepath: path.relative(testPathAbsolute, file.filepath),
        value: getFileStringCount(file.data, "TODO", (caseSensitive = false)),
      }))
    );

    expect(results).to.eql([
      { filepath: "somedir\\somemodule\\somefile.js", value: 2 },
      { filepath: "somedir\\somemodule\\someotherfile.js", value: 1 },
      { filepath: "somedir2\\anotherdir\\index.js", value: 1 },
      {
        filepath: "somedir2\\anotherdir\\yet_another_dir\\index.js",
        value: 1,
      },
      { filepath: "somedir2\\index.js", value: 1 },
      { filepath: "somedir3\\another_file.js", value: 1 },
      { filepath: "somefile.js", value: 2 },
    ]);
  });
  it("get count of string when text is case-sensitive e.g. todo should NOT catch TODO", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const expectedOutput = [
      {
        filepath: "somedir\\somemodule\\somefile.js",
        value: 1,
      },
      {
        filepath: "somefile.js",
        value: 1,
      },
    ];

    const files = await getAllFilesFromDirectory(testPathAbsolute);
    const results = await Promise.all(
      files.map(async (file) => ({
        filepath: path.relative(testPathAbsolute, file.filepath),
        value: getFileStringCount(file.data, "todo", (caseSensitive = true)),
      }))
    );

    const resultsClean = results.filter((file) => file.value > 0);

    expect(resultsClean.length).to.equal(2);

    expect(resultsClean).to.eql(expectedOutput);
  });
});
