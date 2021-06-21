const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const expenses = require("../controller/expenses");
const { check } = require("express-validator");

router.route("/expenses")
 .post(auth, [
  check("description", "Please enter description").not().isEmpty(),
  check("category", "Please enter category").not().isEmpty(),
  check("amount", "Please enter amount").isFloat()
 ], expenses.addNewExpense)
 
 .get(auth, expenses.fetchAllExpenses)

router.route("/expenses/:id").delete(auth, expenses.deleteExpense).patch(auth, expenses.updateExpenses)

module.exports = router;