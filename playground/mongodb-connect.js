//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); //identical to above const MongoClient = require('mongodb').MongoClient;

// let user = {name: 'Ece', age: 2};
//
// var {name} = user; //create a variable with name: name and equal to user.name
//
// console.log(name);

//var obj = new ObjectID(); //create an object equals to ObjectID

//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server...');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('ToDoApp')
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Mehmet',
  //   age: 33,
  //   location: 'Ankara'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  client.close();
});
