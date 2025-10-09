// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
utilities = require("../utilities/")

// Management routes - require Employee/Admin access
router.get("/", utilities.checkInventoryAccess, invController.buildManagementView);
router.get("/add-inventory", utilities.checkInventoryAccess, invController.buildAddInventory);
router.post("/add-inventory", utilities.checkInventoryAccess, invController.processAddInventory);
router.get("/edit/:inv_id", utilities.checkInventoryAccess, invController.editInventoryView);
router.post("/update/", utilities.checkInventoryAccess, invController.updateInventory);
router.get("/add-classification", utilities.checkInventoryAccess, invController.buildAddClassification);
router.post("/add-classification", utilities.checkInventoryAccess, invController.processAddClassification);
router.get("/getInventory/:classification_id", utilities.checkInventoryAccess, utilities.handleErrors(invController.getInventoryJSON))

// Public routes - no access restrictions
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);

module.exports = router;