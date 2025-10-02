const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    let messages = [];
    let className = '';
    let grid = '';

    try {
        const data = await invModel.getInventoryByClassificationId(classification_id)
        grid = await utilities.buildClassificationGrid(data)
        className = data[0].classification_name  + " vehicles";
    } catch (error) {
        messages.push('An error occurred while loading details: ' + error.message);
        className = 'No Classification Found';
    }

    let nav = await utilities.getNav()
   
    res.render("./inventory/classification", {
    title: className,
    nav,
    grid,
    messages: messages.join('<br>')
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  let details = '';
    let className = '';
    let messages = [];
  try {
    const data = await invModel.getInventoryById(inv_id)
    details = await utilities.buildInventoryDetail(data)
    className = data.classification_name
  } catch (error) {
    messages.push('An error occurred while loading details: ' + error.message);
    className = 'No Vehicle Found';
  }

 let nav = await utilities.getNav()

  res.render("./inventory/details", {
    title: className,
    nav,
    details,
    messages: messages.join('<br>')
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.management = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

invCont.processAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  if (!classification_name || classification_name.trim() === "") {
    res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: "Please provide a classification name.",
    })
    return
  }
  try {
    const result = await invModel.addNewClassification(classification_name.trim())
    if (result.rowCount > 0) {
      req.flash(
        "success",
        `The ${classification_name} classification was added successfully.`
      )
      res.status(201).redirect("/inv/add-classification")
    } else {
      res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: "Failed to add classification. Please try again.",
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: "An error occurred while processing your request.",
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationOptions = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationOptions,
    errors: null,
  })
}

invCont.processAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationOptions = await utilities.buildClassificationList()
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  // Validate input fields
  let errors = []
  if (!inv_make || inv_make.trim() === "") errors.push("Make is required.")
  if (!inv_model || inv_model.trim() === "") errors.push("Model is required.")
  if (!inv_year || isNaN(inv_year) || inv_year < 1886) errors.push("Valid year is required.")
  if (!inv_description || inv_description.trim() === "") errors.push("Description is required.")
  if (!inv_price || isNaN(inv_price) || inv_price <= 0) errors.push("Valid price is required.")
  if (!inv_miles || isNaN(inv_miles) || inv_miles < 0) errors.push("Valid miles are required.")
  if (!inv_color || inv_color.trim() === "") errors.push("Color is required.")
  if (!classification_id || isNaN(classification_id)) errors.push("Classification is required.")

  if (errors.length > 0) {
    res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationOptions,
      errors: errors.join(" "),
    })
    return
  }

  try {
    const result = await invModel.addNewInventory(
      inv_make.trim(),
      inv_model.trim(),
      parseInt(inv_year),
      inv_description.trim(),
      inv_image.trim() || "/images/no-image.png",
      inv_thumbnail.trim() || "/images/no-image.png",
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color.trim(),
      parseInt(classification_id)
    )
    if (result.rowCount > 0) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} was added successfully.`
      )
      res.status(201).redirect("/inv/add-inventory")
    } else {
      res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationOptions,
        errors: "Failed to add inventory. Please try again.",
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationOptions,
      errors: "An error occurred while processing your request.",
    })
  }
}

module.exports = invCont