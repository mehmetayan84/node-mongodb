var {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// })

// Todo.findOneAndRemove({text: "Play with Ece"}).then((result) => {
//   console.log(result);
// })

Todo.findByIdAndRemove('5ac3ce609e2f2e73b1eebfe6').then((result) => {
  console.log(result);
})