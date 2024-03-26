require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');

const app = express();

app.use(express.json());

app.get('/category', (req, res) => {
  res.status(200).json({
    message: 'hello world',
  });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
