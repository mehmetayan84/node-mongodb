//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); //identical to above const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server...');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('ToDoApp')

//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5ab9372e33f308d049b7535a')
//   },
//   {
//     $set: {
//       completed: true
//     }
//   },{
//     returnOriginal: false
//   }
// ).then((result) => {
//   console.log(result);
// });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ab419df737f450e28c7b9c8')
  },{
    $set: {
      name: 'Ece Ayan'
    },
    $inc:{
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  client.close();
});
