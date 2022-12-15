import nock from "nock";
import md5 from "js-md5";

export function createScope(token: string) {
  return nock("https://cloud.supernote.com", {
    reqheaders: {
      'x-access-token': token
    }
  });
}

export type MockFileListItem = {
  name: string;
  isFolder: boolean;
  data?: Buffer;
  updateTime?: number
}

export function queueFileList(scope: nock.Scope, directoryId: string, itemList: MockFileListItem[]) {
  let count = 0;
  scope
    .post("/api/file/list/query")
    .reply(200, {
      "success": true,
      "errorCode": null,
      "errorMsg": null,
      "total": itemList.length,
      "userFileVOList": itemList.map(item => ({
        "id": (++count).toString(),
        "directoryId": directoryId,
        "fileName": item.name,
        "size": (!item.isFolder && item.data) ? item.data.length : 0,
        "md5": (!item.isFolder && item.data) ? buffer2md5(item.data) : "",
        "isFolder": item.isFolder ? "Y" : "N",
        "createTime": item.updateTime ?? 0,
        "updateTime": item.updateTime ?? 0
      }
      ))
    });

}

function buffer2md5(buf: Buffer) {
  let hash = md5.create();
  hash.update(buf);
  return hash.hex();
}