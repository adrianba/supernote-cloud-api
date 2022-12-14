import { assert } from "chai";
import supernote from "../src/index.js";
import nock from "nock";

describe("syncFiles tests", function () {
  it("truth", function () {
    assert.equal(!!supernote.syncFiles, true);
  });

  //TODO: need to add sync tests

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
