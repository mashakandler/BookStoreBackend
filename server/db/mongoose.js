var mongoose = require('mongoose');
process.env.MONGODB_URI = 'mongodb://localhost:27017/bookstore';
process.env.RABBIT_URL = "amqp://dqbsydho:psEDL1Q5l7F9j1ZbXVIY-UaoKVOxJTum@sheep.rmq.cloudamqp.com/dqbsydho";

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};