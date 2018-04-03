var {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var userID = '5abeb72c45109105342d482e';

//var id = '5ac0d64a2153f3117808a974'; //Todo ID

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   console.log('Todo by Id', todo);
// });

User.findById(userID).then((user) => {
  if(!user)
  {
    return console.log('User not found');
  }
  console.log('User: ', user);
}).catch((e) => console.log(e));
