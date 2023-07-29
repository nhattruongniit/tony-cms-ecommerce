const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();
app.use(cors());

//
const userRouter = require('./routes/user');

// env
const PORT = process.env.PORT || 3004;

// connect to mongodb
mongoose
  .connect(
    process.env.DB_CONNECT,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log('Connect successfully'))
  .catch(error => console.log('Connect failed', error))


// middleware
app.use(express.json( { extend: true } ));
app.get('/', (_, res) => res.send('API running'));

// routes
app.use('/api/user', userRouter);


// run server
app.listen(PORT,() => {
  console.log(`server is running on port localhost:${PORT}`)
})
