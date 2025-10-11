const utilities = require("../utilities/")
const commentsModel = require("../models/comments-model")
const invModel = require("../models/inventory-model")
const e = require("connect-flash")

async function buildComments(req, res, next) {
    let nav = await utilities.getNav()

    const { inv_id } = req.params

    if (!inv_id || isNaN(inv_id)) {

        req.flash(
            "error",
            "Invalid inventory ID."
        )
        
        res.redirect("/inv/");
        return

    }

    let inv = await invModel.getInventoryById(inv_id)
    if (!inv || Object.keys(inv).length === 0) {
        req.flash(
            "error",
            "No vehicle found for the provided inventory ID."
        )

        res.redirect("/inv/");
        return
    }

    res.render("inventory/comments", {
        title: "Comments: Vehicle " + inv.inv_make + " " + inv.inv_model,
        nav,
        inv_id,
        errors: null
    })
}

async function addNewComment(req, res) {

    const { comment_text, account_id, inv_id } = req.body

    const regResult = await commentsModel.addNewComment(
        inv_id,
        account_id,
        comment_text
    )

    let errors = []
    if (!account_id || account_id.trim() === "") errors.push("Account ID is required.")
    if (!inv_id || inv_id.trim() === "") errors.push("Inventory ID is required.")
    if (!comment_text || comment_text.trim() === "") errors.push("Comment text is required.")
   
    if (errors.length > 0) {

         req.flash(
            "error",
            errors.join('<br>')
        )

        res.redirect("/inv/detail/" + inv_id)

        return
    }

    if (regResult) {

        req.flash(
            "notice",
            `Your comment has been added successfully.`
        )
        res.redirect("/inv/detail/" + inv_id)

    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.redirect("/inv/detail/" + inv_id)
    }

}

async function editComment(req, res) {

    const { comment_id, comment_text, inv_id } = req.body

    const regResult = await commentsModel.editComment(
        comment_id, comment_text
    )

    let errors = []
    if (!comment_id || comment_id.trim() === "") errors.push("Comment ID is required.")
    if (!comment_text || comment_text.trim() === "") errors.push("Comment text is required.")
   
    if (errors.length > 0) {

         req.flash(
            "error",
            errors.join(" ")
        )

        res.redirect("/inv/detail/" + inv_id)

        return
    }

    if (regResult) {
        req.flash(
            "notice",
            `Your comment has been updated successfully.`
        )
        res.redirect("/inv/detail/" + inv_id)

    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.redirect("/inv/detail/" + inv_id)
    }

}

async function getCommentsJSON(req, res, next) {
  const inv_id = req.params.inv_id
  console.log("Fetching comments for inv_id: " + inv_id);
  if (!inv_id || isNaN(inv_id)) {
    return next(new Error("Invalid inventory ID"))
  }

  const canDelete = (res.locals.accountData && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) ? true : false;

  const commentsData = await commentsModel.getCommentsByInvId(inv_id)
  if (commentsData.length > 0) {
    commentsData.forEach(comment => {
        comment.canDelete = canDelete || (res.locals.accountData && comment.account_id === res.locals.accountData.account_id);
    });

    return res.json(commentsData)
  } else {
    return res.json([])
  }
}

async function deleteComment(req, res, next) {
    const comment_id = parseInt(req.params.comment_id)
   
    if (!comment_id || isNaN(comment_id)) {
      return next(new Error("Invalid comment ID"))
    }

    const comment_data = await commentsModel.getCommentById(comment_id)
    const inv_id = comment_data.inv_id;
    
    const accountType = res.locals.accountData.account_type;
    const account_id = res.locals.accountData.account_id;

    if (comment_data.account_id !== account_id){
        if(accountType != "Employee" && accountType != "Admin") {
            req.flash("error", "You are not authorized to delete this comment.")
            return res.redirect("/inv/detail/" + inv_id)
        }
    }

    const delResult = await commentsModel.deleteComment(comment_id)
    console.log("Delete result: " + delResult);
    if (delResult) {
        req.flash(
            "notice",
            `The comment has been deleted successfully.`
        )
         res.redirect("/inv/detail/" + inv_id)
    } else {
        req.flash("notice", "Sorry, the deletion failed.")
         res.redirect("/inv/detail/" + inv_id)
    }
}


module.exports = { buildComments, addNewComment, editComment, getCommentsJSON, deleteComment }