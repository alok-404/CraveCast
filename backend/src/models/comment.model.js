const mongoose = require
("mongoose")


const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user", //jisne comment kiya
        required:true
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"food",//kis food pe comment kiya
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    }
},{
    timestamps:true
})

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;