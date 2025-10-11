// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")

// Route Definitions
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildDashboard));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Account management routes
router.get("/dashboard", utilities.checkLogin, utilities.handleErrors(accountController.buildDashboard));
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView));
router.post("/update", utilities.checkLogin, regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount));
router.post("/change-password", utilities.checkLogin, regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.changePassword));

// Logout route
router.get("/logout", accountController.logout);

module.exports = router;