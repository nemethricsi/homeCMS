const mongoose = require('mongoose').set('useFindAndModify', false);
mongoose
  .connect(
    `mongodb://${process.env.HOST}:${process.env.DB_PORT}/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((err) => console.error(`Error in DB connection: ${err}`));

module.exports = mongoose;
