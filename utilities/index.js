const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li style="list-style-type: none;">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<hr />'
      grid += '</div>'
      grid += '</li>'
      
    })
    grid += '</ul>'
    
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryDetail = async function(data){
    let detail
    if(data){
        detail = '<div id="inv-detail">'
        detail += '<div class="detail-header">'
        detail += '<h1>' + data.inv_make + ' ' + data.inv_model + '</h1>'
        detail += '<p>Classification: ' + data.classification_name + '</p>'
        detail += '</div>'
        detail += '<div class="detail-image">'
        detail += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
        detail += '</div>'
        detail += '<div class="detail-info">'
        detail += '<h2>Price: $ ' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</h2>'
        detail += '<p>Year: ' + data.inv_year + '</p>'
        detail += '<p>Miles: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
        detail += '<p>Color: ' + data.inv_color + '</p>'
        detail += '<p>Description: ' + data.inv_description + '</p>'
        detail += '</div>'
        detail += '</div>'
    } else {
        detail = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }
    return detail
}

module.exports = Util