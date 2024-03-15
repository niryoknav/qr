const mongoose=require('mongoose')
const {model,Schema}=mongoose

const orderSchema=new Schema({
    id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    table:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    orders:{
        type:[],
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

const orderModel=model('order',orderSchema)
module.exports=orderModel