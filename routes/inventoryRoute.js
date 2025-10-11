// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const commentsController = require("../controllers/commentsController")
utilities = require("../utilities/")

// Management routes - require Employee/Admin access
router.get("/", utilities.checkInventoryAccess, utilities.handleErrors(invController.buildManagementView));
router.get("/add-inventory", utilities.checkInventoryAccess, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.checkInventoryAccess, utilities.handleErrors(invController.processAddInventory));
router.get("/edit/:inv_id", utilities.checkInventoryAccess, utilities.handleErrors(invController.editInventoryView));
router.post("/update/", utilities.checkInventoryAccess, utilities.handleErrors(invController.updateInventory));
router.get("/add-classification", utilities.checkInventoryAccess, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.checkInventoryAccess, utilities.handleErrors(invController.processAddClassification));
router.get("/getInventory/:classification_id", utilities.checkInventoryAccess, utilities.handleErrors(invController.getInventoryJSON));

router.get("/comments/:inv_id", utilities.checkInventoryAccess, utilities.handleErrors(commentsController.buildComments))


// Public routes - no access restrictions
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;