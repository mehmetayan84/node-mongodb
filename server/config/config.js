var env = process.env.NODE_ENV || 'development';

if(env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://root:root4node@ds231589.mlab.com:31589/node-todo';
} else if (env == 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://root:root4node@ds237379.mlab.com:37379/node-todo-test';
}