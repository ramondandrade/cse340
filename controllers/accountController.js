const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
        
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the login.')
        res.status(500).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    }

    const loginResult = await accountModel.loginAccount(
        account_email,
        hashedPassword
    )

    if (loginResult.rowCount > 0) {
        req.flash(
            "notice",
            `Welcome back, ${account_email}.`
        )
        res.status(200).render("account/dashboard", {
            title: "Dashboard",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the login failed.")
        res.status(401).render("account/login", {
            title: "Login",
            nav,
        })
    }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

async function buildDashboard(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/dashboard", {
        title: "Dashboard",
        nav,
    })
}

module.exports = { buildLogin, loginAccount, buildRegister, registerAccount, buildDashboard }