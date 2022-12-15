import nock from "nock";
import { assert } from "chai";
import supernote from "../src/index.js";
import { createScope, queueFileList } from "./api.mock.js";

describe("fileList tests", function () {
  it("root", async function () {
    const token = "__token__"
    const scope = createScope(token);

    queueFileList(scope, "0", [
      {
        name: "Note",
        isFolder: true,
        updateTime: 1658265084000
      },
      {
        name: "Document.pdf",
        isFolder: false,
        data: Buffer.from("abcdefg", "utf8"),
        updateTime: 1658265084000
      }
    ]);

    let list = await supernote.fileList(token);

    assert.equal(list.length, 2);
    assert.equal(list[0].isFolder, "Y");
    assert.equal(list[1].isFolder, "N");
    assert.equal(list[0].fileName, "Note");
    assert.equal(list[1].fileName, "Document.pdf");
    scope.done();
  });

  it("subfolder", async function () {
    const token = "__token__";
    const scope = createScope(token);

    const folder = "666666666666666666";
    queueFileList(scope, folder, [
      {
        name: "Note",
        isFolder: true,
        updateTime: 1658265084000
      },
      {
        name: "Document.pdf",
        isFolder: false,
        data: Buffer.from("abcdefg", "utf8"),
        updateTime: 1658265084000
      }
    ]);

    let list = await supernote.fileList(token, folder);

    assert.equal(list.length, 2);
    assert.equal(list[0].isFolder, "Y");
    assert.equal(list[1].isFolder, "N");
    assert.equal(list[0].directoryId, folder);
    assert.equal(list[1].directoryId, folder);
    scope.done();
  });

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
