const mongoose = require("mongoose");

const PersonalExpenses = mongoose.Schema({
 description: {
  type: String,
  required: true
 },
 userId: {
  type: String,
  required: true
 },
 category: {
  type: String,
  required: true,
 },
 amount: {
  type: Number,
  required: true,
 },
 createdAt: {
  type: Date,
  default: Date.now()
 },
 updatedAt: {
  type: Date,
  default: Date.now()
 }
})

const model = mongoose.model("personal-expenses", PersonalExpenses)

module.exports = model;