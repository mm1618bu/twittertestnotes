const mongoose = require("mongoose");
//mongoose.set('useNewUrlParser', true);
//mongoose.set('useUnifiedTopology', true);
//mongoose.set('useFindAndModify',false);
//mongoose.set('useUnifiedTopoloogy',true);

class Database{

    constructor(){
        this.connect();
    }
    connect(){
        mongoose.connect("mongodb+srv://mitchellbarron10:Ma3el683!@cluster0.jlci8rn.mongodb.net/Cluster0?retryWrites=true&w=majority")
        .then(() => {
            console.log("success");
        })
        .catch((err) => {
            console.log("Error" + err);
        })
    }
}

module.exports = new Database();