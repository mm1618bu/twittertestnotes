const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// assign types to user data object
const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        default:"/images/profilePic.jpg"
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    following: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
    followers: [{ type: Schema.Types.ObjectId, ref: 'Post'}]
}, { timestamps: true});

var User = mongoose.model('User',UserSchema);
module.exports = User;