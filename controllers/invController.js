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



module.exports = invCont