const mongoose = require("mongoose")
const mongoUri = "mongodb://localhost:27017/expense-tracker"

const InititateMongoServer = async () => {
 try {
  await mongoose.connect(mongoUri, {
   useNewUrlParser: true,
   useUnifiedTopology: true
  })
  console.log("Connected to database");
 } catch (error) {
  console.log("Erorr while connecting to database", error);
  throw error;
 }
}

module.exports = InititateMongoServer;