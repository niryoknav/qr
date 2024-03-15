
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const orderModel = require('./models/OrderModel')
const menuModel = require('./models/MenuModel')
const userModel = require('./models/UserModel')
const tableModel=require('./models/TableModel')

const app = express()
// // app.use(bodyParser.json({type: 'application/json'}));
// app.use(bodyParser.urlencoded({extended:false}));
// // app.use(bodyParser.text({type: '*/*'}));
const secret = process.env.SECRET
app.use(cors({ origin: ['http://192.168.0.127:3000', 'http://localhost:3000'] }))
app.use(express.json())

const PORT = process.env.PORT || 2024
const mongo_uri = process.env.MONGO_URI

const server = app.listen(PORT, () => {
    console.log("server running on " + PORT)
})

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
io.on('connection', (socket) => {
    // console.log(socket.id)
    // socket.on('send-orders', (order) => {
    //     io.emit('show-order', order)
    //     console.log(order)
    // })
    socket.on('send-status',(data)=>{
        io.emit('update-status',data)
    })
})

app.post('/signup', async (req, res) => {
    // console.log(req.body)
    const { user, pass } = req.body
    console.log(user, pass)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    const userExist = await userModel.findOne({ username: user })
    console.log(userExist)
    if (!userExist) {
        const users = new userModel({ username: user, password: hash })
        await users.save()
        res.status(201).json("user Created")
    } else {
        res.status(400).json("user already exist")
    }
})

app.post('/login', async (req, res) => {
    const { user, pass } = req.body;
    const userExist = await userModel.findOne({ username: user })
    // console.log(userExist.password)
    if (!userExist) {
        res.status(404).json("User does not exist")
    } else {
        const verifyPass = bcrypt.compareSync(pass, userExist.password);
        if (verifyPass) {
            jwt.sign({ user: userExist._id }, secret, { expiresIn: 60 * 60 }, async (err, token) => {
                if (err) throw err
                res.status(201).json(token)
            })
        } else {
            res.status(401).json("invalid credentials")
        }
    }
})

app.post('/verify', async (req, res) => {
    const { token, user } = req.body
    console.log(token, user)
    const userExist = await userModel.findOne({ username: user })
    const ver = jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            res.status(401).json("not allowed")
        }
        res.status(201).json(info)
    })
})

app.post('/addtable',async(req,res)=>{
    const table=new tableModel({id:req.body.table,status:req.body.status})
    await table.save()
    res.status(201).json('created')
})

app.get('/gettables',async(req,res)=>{
    const table=await tableModel.find()
    res.status(201).json(table)
})

app.put('/changestatus',async(req,res)=>{
    const table=await tableModel.findOne({id:req.body.id}).updateOne({status:req.body.status})
    res.status(201).json('updated table status')
})
app.post('/order', async (req, res) => {
    const orders = new orderModel({ id: req.body.id, name: req.body.name, table: req.body.table, mobile: req.body.mobile, orders: req.body.items, amount: req.body.totalPrice, status: req.body.status })
    await orders.save()
    res.status(200).json(req.body)
})
app.get('/showorderbytable/:id',async(req,res)=>{
    const {id}=req.params
    console.log(id)
    const orders=await orderModel.find({table:id})
    res.status(201).json(orders)
})
app.get('/showorders', async (req, res) => {
    const id = req.query.search || ""
    console.log(id)
    const orders = await orderModel.find({ id: { $regex: id, $options: "i" } })
    res.status(200).json(orders)
})
app.put('/status/:id', async (req, res) => {
    const { id } = req.params
    const status = req.body.status
    // console.log(status)
    const order = await orderModel.find({ id: id }).updateOne({ status })
    res.status(200).json("updated")
})
app.post('/additem', async (req, res) => {
    const menu = new menuModel({ name: req.body.name, type: req.body.type, price: req.body.price, des: req.body.des, status: req.body.status })
    await menu.save()
    res.status(200).json('added successfully')
})
app.get('/getmenu/', async (req, res) => {
    const text = req.query.search || ""
    const searchItem = await menuModel.find({ name: { $regex: text, $options: "i" } })
    res.status(200).json(searchItem)
})
app.put('/stockstatus/:id', async (req, res) => {
    const { id } = req.params
    const status = req.body.status
    const menu = await menuModel.findById(id).updateOne({ status })
    res.status(200).json('updated')
})
app.put('/offer/:id', async (req, res) => {
    const { id } = req.params
    const { offer } = req.body
    const x = parseFloat(offer)
    const menu = await menuModel.findById(id)
    var price = parseFloat(menu.price)
    price = price - (price * (x / 100.0))
    await menuModel.findById(id).updateOne({ price: price })
    res.status(201).json('offer applied')

})
// app.get('/search/:text',async(req,res)=>{
//     const {text}=req.params;
//     // text=JSON.stringify(text)
//     // await menuModel.createIndexes({name:"text"})
//     console.log(searchItem)
//     res.status(200).json(searchItem)
// })
mongoose.connect(mongo_uri,
    console.log("Database connected")
)

