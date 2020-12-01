const express = require('express')
const path = require('path')
const expenses = require('./expenses.json')
const app = express()
const expense = require('./server/model/Expense')
app.use(express.static(path.join(__dirname,'./server')))
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/expense',{ useUnifiedTopology: true }, {useNewUrlParser: true })
// for(let i of expenses){
//     let data = new expense(i)
//     data.save()
// }


const port = 3001
app.listen(port,function(){
    console.log(`Running server on port ${port}`)
})