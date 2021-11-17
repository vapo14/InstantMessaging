bigInt = require("./bigInt");

const qr = bigInt(2426697107);
const a = bigInt(17123207);
const privateXKey = bigInt(Math.floor(Math.random() * qr));

console.log(privateXKey);

function compute(a, exp, qr) {
  var res = a.modPow(exp, qr);
  return res.value;
}

console.log(compute(a, privateXKey, qr));
