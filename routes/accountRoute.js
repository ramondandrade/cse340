// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", accountController.buildLogin);
router.post("/login", accountController.loginAccount);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)
router.get("/dashboard", accountController.buildDashboard);

module.exports = router;