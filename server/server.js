var jackrabbit = require('jackrabbit');

process.env.MONGODB_URI = 'mongodb://localhost:27017/bookstore';
process.env.RABBIT_URL = "amqp://dqbsydho:psEDL1Q5l7F9j1ZbXVIY-UaoKVOxJTum@sheep.rmq.cloudamqp.com/dqbsydho";

console.log("BookStoreBackend Server ------ Worker Queue Consumer");
console.log("======================================================");

console.log("-> Connecting to RabbitMQ");
var rabbit = jackrabbit(process.env.RABBIT_URL);
var exchange = rabbit.default();
var hello = exchange.queue({ name: "task_queue", durable: true });
exchange.on("drain", process.exit);
console.log("-> Success");

console.log("->Start listening on Queue task_queue");
hello.consume(onAddReview,{timeout:200});

function onAddReview(data, ack) {
  console.log("Hello, " + data.bookId + "!" + " ts:" + data.ts + " review: " + data.review);
  ack();
}

