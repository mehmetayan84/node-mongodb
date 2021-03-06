const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid e-mail address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
     return token;
  });

  // below code is the identical to above
  // return new Promise((resolve) => {
  //     var user = this;
  //     var access = 'auth';
  //     var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  //     user.token = user.tokens.concat([{access, token}]);
  //     user.save().then(() => {
  //         resolve(token);
  //     })
  // })
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err || !res) {
                    reject();
                } else {
                    // user.generateAuthToken().then((token) => {
                    //     resolve(user);
                    // });
                    resolve(user);
                }
            });
        });
    });
}

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    //"return Promise.reject();" can also be used instead of below one
    return new Promise((resolve, reject) => {
       reject();
    });
  }

  return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
  });

};

UserSchema.methods.removeToken = function(token){
    var user = this;
    //$pull method remove specified property from mongodb object
    //return to return promise
    return user.update({
       $pull: {
           tokens: {
               token
           }
       }
    });

}

UserSchema.pre('save', function(next) {
   var user = this;

   if(user.isModified('password')) {
       bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(user.password, salt, (err, hash) => {
               user.password = hash;
               next();
           });
       });
   } else {
       next();
   }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
