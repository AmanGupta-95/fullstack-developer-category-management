require('dotenv').config();
const app = require('./app');
const connectDB = require('./db/connect');

const port = process.env.PORT || 5000;

// this is where the server starts
const startServer = async () => {
  try {
    // connecting to the mongodb database
    connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
