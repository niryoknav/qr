const mongoose=require('mongoose')
const {Schema,model}=mongoose

const menuSchema=new Schema({
    type:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    des:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
})

const menuModel=model('menu',menuSchema)
module.exports=menuModel