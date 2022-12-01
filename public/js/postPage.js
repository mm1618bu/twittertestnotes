// loads posts to the page

$(document).ready(() => {
    $.get("/api/posts/" + postId, results =>{
        outputPostsWithReplies(results, $(".postsContainer"));
    })
})

