// This makes the submit button on the new post show up or not.
$("#postTextarea, #replyTextarea").keyup(event=>{
    var textbox = $(event.target);
    var value = textbox.val().trim(); // Trims Whitespace from the text box

    var isModal = textbox.parents(".modal").length == 1;

    var submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if(submitButton.length == 0) return alert("no submit button found.");  

    if(value == ""){
        submitButton.prop("disabled", true);        // if the box is empty, the button wont work
        return;
    }

    submitButton.prop("disabled", false);   // if the box has text, the button WILL work
})

// This does the same as above, HOWEVER, this handles replies to posts
$("#submitPostButton, #submitReplyButton").click(() => {
    var button = $(event.target);

    var isModal = button.parents(".modal").length == 1;
    var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    if(isModal){
        var id = button.data().id;
        if(id==null) return alert("Button id is null");
        data.replyTo = id;
    }

    $.post("/api/posts",data,postData => {  //this is a post request that will send the reply to the database and store it.

        if(postData.replyTo){
            location.reload();
        }
        else{
            //this will load the replies to the post at the same time the page loads, so replies will show up immediately.
            var html = createPostHtml(postData);
            console.log(html);
            $(".postsContainer").prepend(html);
            //Then, after reload, the reply box will be empty and the reply button will be disabled until text is in the box.
            textbox.val("");
            button.prop("disabled", true);
        }
    })
})

$("#replyModal").on("show.bs.modal",(event) => {  // This handles replies to the post as they are submited
    console.log("Hi");
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id",postId);

    $.get("/api/posts/" + postId, results => {  // This GET requests pulls all the replies to the post from the database
        outputPosts(results.postData, $("#originalPostContainer"));        //output the replies
    })

})

$("#deletePostModal").on("show.bs.modal",(event) => {   // This assigns functionality to the delete post button
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id",postId);

})

$("#deletePostButton").click(() =>{         //This handles when the delete button is pushed
    var postId = $(event.target).data("id");

    $.ajax({
        url: `/api/posts/${postId}`,        // This will delete the post from the database and reload the page
        type: "DELETE",
        success: () => {
            location.reload();
        }
    })
})

$("#replyModal").on("hidden.bs.modal",(event) => {  // This will hide the reply button
    $("#originalPostContainer").html("");

})

$(document).on("click", ".likeButton",(event) => {  // This handles the like button
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined) return;    // if the post cant be found upon trying to like, return nothing

    $.ajax({
        url: `/api/posts/${postId}/like`,   // put the like record in the database for the specific post
        type: "PUT",
        success: (postData) => {
            
            button.find("span").text(postData.likes.length || " ")  // record of who likes the post
        
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");          // returns who likes the post
            }
            else{
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click", ".retweetButton",(event) => {  // handles retweets
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,    // gets the retweet data from the database
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.retweetUsers.length || " ") // record of who retweets
        
            if(postData.retweetUsers.includes(userLoggedIn._id)){
                button.addClass("active");      // returns who retweets
            }
            else{
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click",".post", (event) =>{     //handles posting the post
    var element = $(event.target);
    var postId = getPostIdFromElement(element);

    if(postId !== undefined && !element.is("button")){
        window.location.href = '/posts/' + postId;
    }
});

function getPostIdFromElement(element){     // hanldes when a post is not found
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post ID undefined");

    return postId;
}

function createPostHtml(postData, largeFont = false){       // handles creation & display of the post

    if(postData == null) return alert("post is null");

    var isRetweet = postData.retweetData !== undefined;     // determine if retweet or not

    var retweetedBy = isRetweet ? postData.postedBy.username : null;
    // postData = isRetweet ? postData.retweetData : postData;
    // console.log(isRetweet);
    
    var postedBy = postData.postedBy;
    if(postedBy._id == undefined){                      // if postedby user account is deleted, return undefined
        return console.log("user object not populated");
    }

    //formmat the data from the post (name, time, likes, retweets)
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var retweenButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

    // If a retweet, display the user who retweeted it
    var largeFontClass = largeFont ? " largeFont" : "";
    var retweetText = '';
    if(isRetweet){
        retweetText = `<span>Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`
    }


    // handling replies
    var replyFlag = "";
    if(postData.replyTo && postData.replyTo._id){

        if(!postData.replyTo._id){
            return alert("reply to is not populated");
        }

        else if(!postData.replyTo.postedBy._id){
            return alert("posted by is not populated");
        }

        var replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}<a>
                    </div>`;
    }

    var buttons = "";
    if(postData.postedBy._id == userLoggedIn._id){
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`;
    }


    //handling the output of the posts - This is how to output each post in the database
    return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class="postButtonContainer">
                                <button data-toggle='modal' data-target='#replyModal'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweenButtonActiveClass}">
                                <i class="fa-solid fa-retweet"></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>`;

}

function outputPosts(results, container){
    container.html("");


    if(!Array.isArray(results)){
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if(results.length == 0){
        container.append("<span class='noResults'> no results found.</span>")
    }
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000<30) return "just now";
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPostsWithReplies(results, container){
    container.html("");

    if(results.replyTo !== undefined && results.replyTo._Id !== undefined){
        var html = createPostHtml(results.replyTo)
        container.append(html);
    }

    var mainPostHtml = createPostHtml(results.postData,true)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

}