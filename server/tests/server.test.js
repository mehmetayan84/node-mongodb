const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'Test todo 1'
}, {
  _id: new ObjectID(),
  text: 'Test todo 2'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// });

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Todo test';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done()
        }).catch((e) => done(e));
      });
  });

  it('should not create a new todo', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('GET /todos', () => {

  it('should fetch all the data from mongodb', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);
    });
});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
    });

    it('should return 404 when todo not found', (done) => {
      var todoId = todos[0]._id.toHexString();
      var firstChar = (Number)(todoId.charAt(0));
      var firstChar = firstChar + 1;
      var todoId = firstChar + todoId.substring(1);
      request(app)
        .get(`/todos/${todoId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 when id is not valid', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {

  it('should delete todo doc', (done) => {
    const id = todos[0]._id.toHexString();
    request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        }).end((err, res) => {
          if(err) {
            return done(err);
          }
          Todo.findById(id).then((todo) => {
              if (!todo) {
                  return done();
              }
              return done('Document could not be deleted');
          }).catch((e) => done(e));
          //same as above down below
          // Todo.findById(id).then((todo) => {
          //   expect(todo).toNotExist();
          //   done();
          // }).catch((e) => done(e));
    });
  });

  it('should return 404 when todo not found', (done) => {
    var id = new ObjectID();
    request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
  });

    it('should return 404 when ObjectId is not valid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});
