var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<root>:<root4node>@ds231589.mlab.com:31589/node-todo');

module.exports = {
  mongoose: mongoose
}
