const mongoose = require('mongoose');
function connect() {
  const connectionString =
  "mongodb+srv://" +
  process.env.DBUSER +
  ":" +
  process.env.DBPASSWORD +
  "@" +
  process.env.DBHOST +
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