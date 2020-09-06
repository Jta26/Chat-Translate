const mongoose = require('mongoose');

function connect() {
  const connectionString =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASSWORD +
  "@" +
  process.env.HOST +
  "/" +
  process.env.DATABASE +
  "?retryWrites=true&w=majority";

  const connection = mongoose.connect(connectionString, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connection Initialized');
  });

}

module.exports = {
  connect,
}