const Expenses = require("../models/personalExpenses");
const Users = require("../models/users");
const { EXPENSES } = require("../constants/expenses");
const { CATEGORIES } = EXPENSES
const { validationResult } = require("express-validator");
const mongodb = require("mongodb")

module.exports.addNewExpense = async function (req, res) {
 try {
  const userId = req.user.id;
  let user = await Users.findById(userId);
  if (!user) {
   return res.status(400).json({
    status: 400,
    message: "User does not exist!"
   });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({
    status: 400,
    errors: errors.array()
   });
  }

  const { description, category, amount } = req.body;
  if (!CATEGORIES[category]) {
   return res.status(400).json({
    status: 400,
    message: "Select a valid category!"
   });
  }

  let newExpense = new Expenses({
   userId, amount: Number(amount), category, description
  })

  await newExpense.save();
  res.status(200).json({
   id: newExpense.id,
   amount, category, description
  })


 } catch (error) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  });
 }
}

module.exports.fetchAllExpenses = async function (req, res) {
 try {
  const userId = req.user.id;
  const query = [
   {
    "$match": { userId: userId }
   },
   // {
   //  "$group": {
   //   "_id": {$substr: ['$createdAt', 5, 2]}
   //  }
   // },
   {
    "$project": { 
     _id: 0,
     id: "$_id",
     createdAt: "$createdAt",
     updateAt: "$updatedAt",
     amount: "$amount",
     category: "$category",
     description: "$description",
     userId: "$userId", 
    }
   }
  ] 
  let user = await Users.findById(userId);
  if (!user) {
   return res.status(400).json({
    status: 400,
    message: "User does not exist!"
   });
  }

  let allExpenses = await Expenses.aggregate(query)

  res.status(200).send(allExpenses)

 } catch (error) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  });
 }
}

module.exports.deleteExpense = async function (req, res) {
 try {
  const userId = req.user.id;
  let user = await Users.findById(userId);
  if (!user) {
   return res.status(400).json({
    status: 400,
    message: "User does not exist!"
   });
  }
  const { id } = req.params
  const query = { _id: new mongodb.ObjectID(id) }

  const deletedExpense = await Expenses.deleteOne(query)
  if (!deletedExpense.deletedCount) {
   return res.status(400).json({
    status: 400,
    message: "Expense does not exist!"
   });
  }

  return res.status(200).json({
   status: 200,
   message: "Expense deleted successfully"
  })

 } catch (error) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  });
 }
}

module.exports.updateExpenses = async function (req, res) {
 try {
  const userId = req.user.id;
  let user = await Users.findById(userId);
  if (!user) {
   return res.status(400).json({
    status: 400,
    message: "User does not exist!"
   });
  }
  const { id } = req.params

  const expense = await Expenses.updateOne(
   {
    _id: id
   },
   {
    "$set": { ...req.body, "updatedAt": Date.now()}
   }
  )
  
  if(expense.n === 0) {
   return res.status(400).json({
    status: 400,
    message: "Expense does not exist!"
   });
  } 

  return res.status(200).json({
   id: id,
   ...req.body
  })

 } catch (error) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  });
 }
}