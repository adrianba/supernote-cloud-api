import { assert } from "chai";
import { login } from "../src/index.js";
import nock from "nock";

describe("login tests", function () {
  it("truth", function () {
    assert.equal(!!login, true);
  });

  it("success", async function () {
    const email = "email@example.com"
    const scope = nock("https://cloud.supernote.com")
      .post("/api/official/user/query/random/code", (body) =>
        body.countryCode == 93 && body.account == email
      )
      .reply(200, {
        "success": true,
        "errorCode": null,
        "errorMsg": null,
        "randomCode": "12345678",
        "timestamp": 1234567890123
      })
      .post("/api/official/user/account/login/new", (body) =>
        body.countryCode == 93 && body.account == email && body.password == "4d7b223baa98f7cbaf870e309a1335e4b538bb56e3a4604575917fdd45c3ec0e"
      )
      .reply(200, {
        "success": true,
        "errorCode": null,
        "errorMsg": null,
        "token": "__token__",
        "counts": null,
        "userName": null,
        "avatarsUrl": null,
        "lastUpdateTime": null,
        "isBind": "Y",
        "isBindEquipment": null,
        "soldOutCount": 0
      });
    let token = await login(email, "00000000");
    assert.equal(token, "__token__");
    scope.done();
  });

  it("invalid", async function () {
    const email = "email@example.com"
    const scope = nock("https://cloud.supernote.com")
      .post("/api/official/user/query/random/code", (body) =>
        body.countryCode == 93 && body.account == email
      )
      .reply(200, {
        "success": true,
        "errorCode": null,
        "errorMsg": null,
        "randomCode": "12345678",
        "timestamp": 1234567890123
      })
      .post("/api/official/user/account/login/new")
      .reply(200, {
        "success": false,
        "errorCode": null,
        "errorMsg": null,
        "token": null,
        "counts": null,
        "userName": null,
        "avatarsUrl": null,
        "lastUpdateTime": null,
        "isBind": null,
        "isBindEquipment": null,
        "soldOutCount": 0
      });
    let token = await login(email, "00000000");
    assert.equal(token, null);
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
