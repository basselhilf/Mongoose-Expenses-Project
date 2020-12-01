const express = require('express')
const { read } = require('fs')
const router = express.Router()
const moment = require('moment')
const mongoose = require('mongoose')

const Expense = require('../model/Expenses')
const Schema = mongoose.Schema

//Getting Expenses
router.get('/expenses',function(request,response){
    Expense.find({}).sort({"date":1}).exec(function(err,expenses){
        response.send(expenses)
    })
})

//Add New Expenses
router.post('/expense',function(request,response){
    let postObj = {
        name : request.body.name,
        amount:request.body.amount,
        date:(request.body.date)?moment(request.body.date).format("LLLL"):moment(new Date()).format("LLLL"),
        group:request.body.group
    }
    const newExpense = new Expense(postObj)
    newExpense.save().then(function(err,count){
        console.log("We have a " + count + " Expenses")
    })
})

//Update Expenses
router.put('/update',function(request,response){
    Expense.findOneAndUpdate(
        {group:`${request.body.group1}`},
        {$set:{group:`${request.body.group2}`}},
        {new:true}       
    ).exec(function(err,expense){
        response.send(expense.name + " changed to " + expense.group)
    })
})

//Final parts
router.get('/expenses/:group',function(request,response){
    let d1 = request.query.d1?moment(request.query.d1).format("LLLL"):moment().format("LLLL")
    let d2 = request.query.d1?moment(request.query.d1).format("LLLL"):moment().format("LLLL")

    if(request.query.total=="true"){
        Expense.aggregate([{$match:{group:`${request.params.group}`}},
                           {$group:{_id:`$group`,total:{$sum:`$amount`}}}
        ]).exec(function(err,totalAmount){
            if(err){response.send(err)}
            if(!totalAmount.length){return response.send("Empty")}
            let total = totalAmount[0].total
            response.send(total.toString())
        })
    }
    else if(d1){
        console.log(d1)
        console.log(d2)
        Expense.find({$and:[{date:{$gte:d1}},{date:{$lte:d2}}]})
        .exec(function(err,data){
            response.send(data)
        })
    }
    else {
        Expense.find({group:`${request.params.group}`}).exec(function(err,expensesByGroup){
            response.send(expensesByGroup)
        })
    }
})

module.exports=router