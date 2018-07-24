var jackrabbit = require('jackrabbit');
var {Book} = require('./models/book');
var {Review} = require('./models/review');
const {ObjectID} = require('mongodb');

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
  var bookId = data.bookId;
  var review = data.review;
  console.log("Got Review ! " + bookId+ "!" + " ts:" + data.ts + " review: " + review);
  
  if (!ObjectID.isValid(bookId)) {
    console.log("objectId is not valid");
    return 1;
  }
  console.log("about to find a book" + bookId);
  Book.findById(new ObjectID(bookId),function(err,book) {
    console.log("b1");
    if (!book) {
      console.log("No book with id" + id + " could be found.");
      return 1;
    }
    console.log("Book Found !!!!");
    var rev = new Review();
    rev.bookId = bookId;
    rev.review = review;
    console.log("about to save review");
    rev.save().then((doc) => {
      console.log("Review Saved Successfully.");
    }, (e) => {
        console.log("Review Save Error" + e);
    });
  });

  ack();
  
}
