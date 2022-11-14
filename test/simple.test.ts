import { assert } from "chai";
import { login } from "../src/index.js";
import nock from "nock";

describe("Tests", function () {
  describe("silly test", function () {
    it("truth", function () {
      assert.equal(!!login, true);
    });
  });
  describe("login", function () {
    it("success", async function () {
      const email = "email@example.com"
      const scope = nock("https://cloud.supernote.com")
        .post("/api/official/user/query/random/code"/*, { countryCode: 93, account: email }*/)
        .reply(200, {
          "success": true,
          "errorCode": null,
          "errorMsg": null,
          "randomCode": "12345678",
          "timestamp": 1234567890123
        })
        .post("/api/official/user/account/login/new")
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
      assert.notEqual(token, null);
      assert.equal(token, "__token__");
    });
  });
});
