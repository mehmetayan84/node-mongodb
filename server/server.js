require('./config/config');

const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) =>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:todoId', (req, res) => {

  var id = req.params.todoId;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:todoId', (req, res) => {
  var id = req.params.todoId;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }, (e) => {
    res.status(400).send();
  })

})

app.patch('/todos/:todoId', (req, res) => {
  var id = req.params.todoId;

  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
      return res.status(404).send();
  }

  if(typeof body.completed == 'boolean' && body.completed) { //_.isBoolean(body.completed) can be used instead of typeof
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,
      {$set: body},
      {new: true /*new:true is same returnOriginal:false*/}).then((todo) => {
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });

});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

module.exports = {app}
