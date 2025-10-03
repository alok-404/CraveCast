const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  food: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"food",
    require:true
  }
},{
    timestamps:true
});


const Like = mongoose.model('like' , likeSchema);
module.exports = Like;