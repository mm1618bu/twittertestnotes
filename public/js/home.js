//loads all the posts and replies to the page

$(document).ready(() => {
    $.get("/api/posts", results =>{
        console.log(results);
        outputPosts(results, $(".postsContainer"));
    })
})

