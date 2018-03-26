//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); //identical to above const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server...');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('ToDoApp')

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result.result);
  // });
  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result.result);
  // });
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Mehmet'}).then((result) => {
  //   console.log(result.result);
  // });

  db.collection('Users').find({name: 'Mehmet'}).toArray().then((docs) => {
      if(docs.length === 0) {
        throw new Error('Fetching error');
      }else {
        db.collection('Users').findOneAndDelete({_id: docs[0]._id}).then((result) => {
          console.log(result);
        }, (err) => {
          throw new Error('Deleting error');
        });
      }
  }).catch((err) => {
    console.log(err.message);
  });

  // client.close();
});
