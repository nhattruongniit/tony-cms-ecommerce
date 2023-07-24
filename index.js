const express = require('express');
const mongoose = require('mongoose');
const app = express();

//
const userRouter = require('./routes/user');


// connect to mongodb
mongoose
  .connect(
    "mongodb+srv://nhattruongniit:4GSvxHcwA2TvxEfN@cms.plxqbz6.mongodb.net/?retryWrites=true&w=majority",
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
app.listen(3004,() => {
  console.log('server is running on port localhost:3004')
})
