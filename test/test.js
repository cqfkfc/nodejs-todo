var expect = require("chai").expect;
const path = require("path");

const { checkNestedFilesForText } = require("../todo-finder");

describe("search todo in directory", () => {
  it("example provided in github", async () => {
    const testDir = "./test_example";
    const testPathAbsolute = path.join(__dirname, testDir);

    const expectedOutput = [
      "\\somedir\\somemodule\\somefile.js",
      "\\somedir\\somemodule\\someotherfile.js",
      "\\somedir2\\anotherdir\\yet_another_dir\\index.js",
      "\\somedir2\\anotherdir\\index.js",
      "\\somedir2\\index.js",
      "\\somedir3\\another_file.js",
    ];

    const actualOutput = await checkNestedFilesForText(testPathAbsolute);

    // there should only be 6 files
    expect(actualOutput.length).to.equal(6);

    actualOutput.forEach((output) =>
      expect(output).to.contain.oneOf(expectedOutput)
    );
  });
});
