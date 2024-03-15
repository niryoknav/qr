const mongoose=require('mongoose')
const {model,Schema}=mongoose

const tableSchema=new Schema({
    id:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    }
})

const tableModel=model('table',tableSchema)
module.exports=tableModel