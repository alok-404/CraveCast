const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodpartner" // MUST BE LINKED TO THE NEW MODEL
    },
    
    // --- RECOMMENDED CHANGES: Remove redundant count fields, add linking array ---
    
    // We don't need these counts anymore as we have separate Like/Comment models
    // likeCount:{ type:Number, default:0 },
    // commentCount: { type: Number, default: 0 },
    // saveCount: { type: Number, default: 0 }
    
    // Add arrays to link all comments, likes, and saves directly to the food video
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment" // Your existing commentModel
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "like" // Your existing likeModel
    }],
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "save" // Your existing saveModel
    }]
    
    // --- END OF CHANGES ---

})

const foodModel = mongoose.model("food",foodSchema);

module.exports = foodModel;