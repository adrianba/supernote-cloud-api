import { assert } from "chai";
import { login } from "../src/index.js";

describe("Tests", function () {
  describe("load()", function () {
    it("truth", function () {
      assert.equal(!!login, true);
    });
  });
});
