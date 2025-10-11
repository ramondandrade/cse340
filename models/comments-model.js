const pool = require("../database/")

/* ***************************
 *  Get all comments for a specific inventory item by inv_id
 * ************************** */
async function getCommentsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.comment_date, a.account_firstname, a.account_lastname
      FROM public.comments AS c
      JOIN public.account AS a
      ON c.account_id = a.account_id
      WHERE c.inv_id = $1
      ORDER BY c.comment_date DESC`,
      [inv_id]
    )
    return data.rows || []
  } catch (error) {
    console.error("getCommentsByInvId error " + error)
    return []
  }
}

/* ***************************
 *  Add a new comment for a specific inventory item
 * ************************** */
async function addNewComment(inv_id, account_id, comment_text) {
  try {
    const data = await pool.query(
      "INSERT INTO public.comments (inv_id, account_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
      [inv_id, account_id, comment_text]
    )
    return data.rows[0]
  } catch (error) {
    console.error("addNewComment error " + error)
    return null
  }
}

/* ***************************
* Edit an existing comment
* ************************** */
async function editComment(comment_id, comment_text) {
  try {
    const data = await pool.query(
      "UPDATE public.comments SET comment_text = $1, comment_date = CURRENT_TIMESTAMP WHERE comment_id = $2 RETURNING *",
      [comment_text, comment_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("editComment error " + error)
    return null
  }
}

async function getCommentById(comment_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.comments WHERE comment_id = $1",
      [comment_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getCommentById error " + error)
    return null
  }
}

/**
 * deleteComment - Deletes a comment by its ID.
 *
 * @param {number} comment_id - The ID of the comment to delete.
 */
async function deleteComment(comment_id) {
  try {
    const data = await pool.query(
      "DELETE FROM public.comments WHERE comment_id = $1 RETURNING *",
      [comment_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("deleteComment error " + error)
    return null
  }
}

module.exports = { getCommentsByInvId, getCommentById, addNewComment, editComment, deleteComment }
