const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
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

describe('PATCH /todos/:id', () => {

    it('should update a todo doc', (done) => {
       const id = todos[0]._id.toHexString();
       request(app)
           .patch(`/todos/${id}`)
           .send({text: 'Love Ece', completed: true})
           .expect(200)
           .expect((res) => {
               expect(res.body.todo.completed).toBe(true);
               expect(res.body.todo.text).toBe('Love Ece');
               expect(res.body.todo.completedAt).not.toBe(null);
           })
           .end(done);
    });

    it('should update a completed todo doc', (done) => {
        const id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({text: 'Play with Ece', completed: false})
            .expect(200)
            .expect((res) => {
               expect(res.body.todo.completed).toBe(false);
               expect(res.body.todo.text).toBe('Play with Ece');
               expect(res.body.todo.completedAt).not.toBeTruthy()
            })
            .end(done);
    });
});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        const token = users[0].tokens[0].token;
        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.email).toBe(users[0].email);
                expect(res.body.user._id).toBe(users[0]._id.toHexString());
            }).end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.user).not.toBeTruthy();
            })
            .end(done);
    });
});

describe('POST /users', () => {

    it('should create a user', (done) => {
        user = {email: 'neslihan@example.com', password: 'ece123'};
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.user.email).toBe(user.email);
            }).end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email: user.email}).then((doc) => {
                    expect(doc.email).toBe(user.email);
                    expect(doc.password).not.toBe(user.password);
                    done();
                }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({email: 'aaa', password: '123'})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.email.message).toBeTruthy();
            }).end(done);
    });

    it('should not create user if the email is in use', (done) => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: users[0].password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toBeTruthy();
            }).end(done);
    });
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
       request(app)
           .post('/users/login')
           .send({email: users[1].email, password: users[1].password})
           .expect(200)
           .expect((res) => {
               expect(res.headers['x-auth']).toBeTruthy();
           }).end((err, res) => {
               if(err) {
                   return done(err);
               }

               User.findById(users[1]._id).then((user) => {
                   expect(user.toObject().tokens[0]).toMatchObject({
                       access: 'auth',
                       token: res.headers['x-auth']
                   });
                   done();
               }).catch((e) => done(e));
       });
    });

    it('should reject invalid login', (done) => {
       request(app)
           .post('/users/login')
           .send({email: users[1].email, password: 'abc*'})
           .expect(400)
           .expect((res) => {
               expect(res.headers['x-auth']).not.toBeTruthy();
           }).end((err, res) => {
               if(err) {
                   return done(err);
               }
               User.findById(users[1]._id).then((user) => {
                 expect(user.tokens.length).toBe(0);
                 done();
               }).catch((e) => done(e));
       })
    });
});