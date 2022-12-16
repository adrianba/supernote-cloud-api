import mockfs from "mock-fs";
import nock from "nock";
import { assert } from "chai";
import supernote from "../src/index.js";
import { createScope, queueFileList, MockFileListItem, queueFileDownload } from "./api.mock.js";

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

  it("check newer file", async () => {
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
        content: Buffer.from("hello2", "utf8"),
        mtime: new Date((fileItem.updateTime ?? 0) + 10000)
      })
    });

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
  });

  it("download new file", async () => {
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
    mockfs({});

    const fileHost = "https://storage/";
    queueFileDownload(scope, fileHost, fileItem);
    const downloadScope = nock(fileHost).get("/" + fileItem.name).reply(200, fileItem.data);

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
    assert(downloadScope.isDone(), "download network requests incomplete");
  });

  it("failed download", async () => {
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
    mockfs({});

    const fileHost = "https://storage/";
    queueFileDownload(scope, fileHost, fileItem);
    const downloadScope = nock(fileHost).get("/" + fileItem.name).reply(404, "Not found");

    await supernote.syncFiles(token, ".");

    assert(scope.isDone(), "network requests incomplete");
    assert(downloadScope.isDone(), "download network requests incomplete");
  });

  it("folder instead of download", async () => {
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
      "data.txt": {}
    });

    try {
      await supernote.syncFiles(token, ".");
    } catch (e) {
      assert.equal(e, "Not a file: data.txt");
    }

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
