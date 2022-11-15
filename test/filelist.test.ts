import { assert } from "chai";
import { fileList } from "../src/index.js";
import nock from "nock";

describe("fileList tests", function () {
  it("truth", function () {
    assert.equal(!!fileList, true);
  });

  it("root", async function () {
    const token = "__token__"
    const scope = nock("https://cloud.supernote.com", {
      reqheaders: {
        'x-access-token': token
      }
    })
      .post("/api/file/list/query")
      .reply(200, {
        "success": true,
        "errorCode": null,
        "errorMsg": null,
        "total": 2,
        "userFileVOList": [
          {
            "id": "777777777777777777",
            "directoryId": "0",
            "fileName": "Note",
            "size": 0,
            "md5": "",
            "isFolder": "Y",
            "createTime": 1658265084000,
            "updateTime": 1658265084000
          },
          {
            "id": "888888888888888888",
            "directoryId": "0",
            "fileName": "Document.pdf",
            "size": 1234567,
            "md5": "6eb7ecd1513712b2eb77c3b56c32609d",
            "isFolder": "N",
            "createTime": 1658265084000,
            "updateTime": 1658265084000
          },
        ]
      });
    let list = await fileList(token);
    assert.equal(list.length, 2);
    assert.equal(list[0].isFolder, "Y");
    assert.equal(list[1].isFolder, "N");
    scope.done();
  });

  it("subfolder", async function () {
    const token = "__token__";
    const folder = "666666666666666666";
    const scope = nock("https://cloud.supernote.com", {
      reqheaders: {
        'x-access-token': token
      }
    })
      .post("/api/file/list/query", body =>
        body.directoryId == folder
      )
      .reply(200, {
        "success": true,
        "errorCode": null,
        "errorMsg": null,
        "total": 2,
        "userFileVOList": [
          {
            "id": "777777777777777777",
            "directoryId": folder,
            "fileName": "Note",
            "size": 0,
            "md5": "",
            "isFolder": "Y",
            "createTime": 1658265084000,
            "updateTime": 1658265084000
          },
          {
            "id": "888888888888888888",
            "directoryId": folder,
            "fileName": "Document.pdf",
            "size": 1234567,
            "md5": "6eb7ecd1513712b2eb77c3b56c32609d",
            "isFolder": "N",
            "createTime": 1658265084000,
            "updateTime": 1658265084000
          },
        ]
      });
    let list = await fileList(token, folder);
    assert.equal(list.length, 2);
    assert.equal(list[0].isFolder, "Y");
    assert.equal(list[1].isFolder, "N");
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
