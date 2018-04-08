const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//    bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//    });
// });

var hashed = '$2a$10$PTpsJD45Ag2nhXY01k/.2elcCtdRd.3BES0zKyc7JEC7rGTDUGr/u';

bcrypt.compare(password, hashed, (err, res) => {
   console.log(res);
});

// var data = {
//     id: 10
// };

// console.log(JSON.stringify(data));
//
// var token = jwt.sign(data, 'mehmet');
//
// console.log(token);
//
// var decode = jwt.verify(token, 'mehmet');
//
// console.log(decode);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
//
// console.log(`Hash: ${hash}`);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//     console.log('The value wasn\'t changed');
// } else {
//     console.log('The value was changed. Don\'t trust it');
// }