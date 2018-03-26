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

  // db.collection('Todos').find({
  //   _id: new ObjectID('5ab418112d69770f882abed6')
  // }).toArray().then((docs) => {
  //   console.log('All todos that are incomplete:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch data');
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Number of todos are ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch data');
  // });

  db.collection('Users').find({name: 'Ece'}).count().then((count) => {
    console.log(`Number of users is ${count}`);
  }, (err) => {
    console.log('Unable to fetch data');
  });

  client.close();
});
