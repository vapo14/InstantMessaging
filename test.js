const crypto = require("crypto");

function encodeDesECB(textToEncode, keyString = "10100101") {
  var key = new Buffer.from(keyString.substring(0, 8), "utf8");
  var cipher = crypto.createCipheriv("des-ecb", key, "");

  var c = cipher.update(textToEncode, "utf8", "base64");
  c += cipher.final("base64");

  return c;
}

console.log(encodeDesECB("olis"));
