const express = require("express")
const router = new express.Router() 
const commentsController = require("../controllers/commentsController")
const utilities = require("../utilities/")

router.get("/getComments/:inv_id", utilities.handleErrors(commentsController.getCommentsJSON))
router.post("/addComment", utilities.handleErrors(commentsController.addNewComment))
router.get("/deleteComment/:comment_id", utilities.handleErrors(commentsController.deleteComment))

module.exports = router;
