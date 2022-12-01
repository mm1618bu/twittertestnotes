const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// pull all the data from the database and format it to specific data types
const PostSchema = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post'},
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post'}
}, { timestamps: true});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;