import mockfs from "mock-fs";
import nock from "nock";
import { assert } from "chai";
import supernote from "../src/index.js";
import { createScope, queueFileList, MockFileListItem } from "./api.mock.js";

describe("syncFiles tests", function () {
  it("iterate into folder", async () => {
    const token = "__token__"
    const scope = createScope(token);

    queueFileList(scope, "0", [
      {
        name: "Note",
        isFolder: true,
        updateTime: 1658265084000
      }
    ]);
    queueFileList(scope, "1", []);
    mockfs({});

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
  });

  it("check matching root file", async () => {
    const token = "__token__"
    const scope = createScope(token);

    let fileItem: MockFileListItem =
    {
      name: "data.txt",
      isFolder: false,
      data: Buffer.from("hello", "utf8"),
      updateTime: 1658265084000
    };
    queueFileList(scope, "0", [fileItem]);
    mockfs({
      [fileItem.name]: mockfs.file({
        content: fileItem.data,
        mtime: new Date(fileItem.updateTime ?? 0)
      })
    });

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
  });

  it("check matching subfolder file", async () => {
    const token = "__token__"
    const scope = createScope(token);

    queueFileList(scope, "0", [
      {
        name: "Note",
        isFolder: true,
        updateTime: 1658265084000
      }
    ]);
    let fileItem: MockFileListItem =
    {
      name: "data.txt",
      isFolder: false,
      data: Buffer.from("hello", "utf8"),
      updateTime: 1658265084000
    };
    queueFileList(scope, "1", [fileItem]);
    mockfs({
      "Note": {
        [fileItem.name]: mockfs.file({
          content: fileItem.data,
          mtime: new Date(fileItem.updateTime ?? 0)
        })
      }
    });

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
  });

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    mockfs.restore();
  });
});
