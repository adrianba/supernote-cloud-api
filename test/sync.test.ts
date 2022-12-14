import { assert } from "chai";
import supernote from "../src/index.js";
import nock from "nock";

describe("syncFiles tests", function () {
  it("truth", function () {
    assert.equal(!!supernote.syncFiles, true);
  });

  //TODO: need to add sync tests

  it("sync", async () => {
    /*
    let token = await supernote.login("a", "b");
    console.log(token);
    await supernote.syncFiles(token, "/tmp/sync");
    */
  }).timeout(60000);

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
