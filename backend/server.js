require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// for handling json data
app.use(express.json());

// route middleware for handling category route
app.use('/api/v1/category', categoryRoutes);

// handling unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const port = process.env.PORT || 5000;

// this is where the server starts
const startServer = async () => {
  try {
    // connecting to the mongodb database
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
