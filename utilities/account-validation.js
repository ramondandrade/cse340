const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email,
      })
      return
  }
  next()
}

validate.loginRules = () => {
  return [
      // valid email is required
      body("account_email")
          .trim()
          .isEmail()
          .normalizeEmail() // refer to validator.js docs
          .withMessage("A valid email is required."),

      // password is required
      body("account_password")
          .trim()
          .notEmpty()
          .withMessage("Please provide a password."),
  ]
}

/*  **********************************
*  Account Update Data Validation Rules
* ********************************* */
validate.updateAccountRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // valid email is required and cannot already exist if it's being changed
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const existingAccount = await accountModel.getAccountById(account_id)
                if (existingAccount.account_email !== account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please use a different email")
                    }
                }
            }),
    ]
}

/* ******************************
 * Check account update data and return errors or continue 
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            accountData,
        })
        return
    }
    next()
}

/*  **********************************
*  Password Change Validation Rules
* ********************************* */
validate.passwordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check password change data and return errors or continue 
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            accountData,
        })
        return
    }
    next()
}

module.exports = validate