'use strict'

function loadComments(inv_id) {

    console.log("Loading comments for inv_id: " + inv_id);

    if(!inv_id || inv_id == ''){ return }
    
    let url = "/comments/getComments/" + inv_id;
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            if (data.length > 0) {
                buildCommentList(data);
            }
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}


// Build inventory items into HTML table components and inject into DOM 
function buildCommentList(data) {
    let commentsDisplay = document.getElementById("comments-list");
    // Set up the table labels 
    let dataTable = '';
    dataTable += '<tbody>';

    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) {
        let date = new Date(element.comment_date);
        let formattedDate = date.toLocaleDateString();
        let deleteUrlComplete = (element.canDelete) ? '<p><a href="/comments/deleteComment/' + element.comment_id + '" title="Delete comment" class="delete-comment">Delete</a></p>' : '';
        dataTable += `<tr><td><div class="comments"><i style="font-size: 0.8rem; color: #555;">${formattedDate} - ${element.account_firstname}</i><p>"${element.comment_text}"</p>${deleteUrlComplete}</div></td>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view 
    commentsDisplay.innerHTML = dataTable;
}