import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema (
    {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type: String, // optional field
        default: "",
    }
       },
    {
    timestamps: true, 
  }
)

userSchema.plugin(mongooseAggregatePaginate);

export const user = mongoose.model("User", userSchema);
