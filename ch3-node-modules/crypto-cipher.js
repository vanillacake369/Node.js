const crypto = require("crypto");

const cipher = crypto.createCipheriv("aes-256-cbc", "열쇠");
let result = cipher.update("암호화할 문장", "utf8", "base64");
result += cipher.final("base64");
console.log("암호화", result);

