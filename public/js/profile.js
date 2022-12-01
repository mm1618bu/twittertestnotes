
//load replies to the replies tab
$(document).ready(() => {
    if(selectedTab === "replies"){
        loadReplies();
    }
    else{
        loadPosts();
    }
});

// load posts to the posts tab
function loadPosts(){
    $.get("/api/posts", { postedBy: profileUserId, isReply: false }, results => {
        outputPosts(results, $(".postsContainer"));
    })
}

function loadReplies(){
    $.get("/api/posts", { postedBy: profileUserId, isReply: true }, results => {
        outputPosts(results, $(".postsContainer"));
    })
}