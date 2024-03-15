const mongoose=require('mongoose')
const {model,Schema}=mongoose

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
})

const userModel=model('user',userSchema)
module.exports=userModel