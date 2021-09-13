'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
let server=express();
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');
const PORT = process.env.PORT 
// mongoose.connect(`${process.env.ATLAs}`,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect(`${process.env.ATLAs}`, { useNewUrlParser: true, useUnifiedTopology: true });

const chocoschema = new mongoose.Schema({
    title:  String, 
    imageUrl:   String,
    description: String,
    price:String,
    email:String,
    
   
  });

  const chocoModel = mongoose.model('Cholcolate', chocoschema);



server.get('/getchocolate',chochhandler);
server.get('/getfav',favioratehandler);
server.delete('/delete/:id',deletehandler);
server.put('/Update/:id',updatehandler);
server.post('/Add',Addhandler);

async function chochhandler(req,res){
    console.log('hi');
let chochoData=await axios.get('https://ltuc-asac-api.herokuapp.com/allChocolateData');

let newArr=chochoData.data.map(item=>{
    return new Choho(item.id,item.title,item.price,item.description,item.imageUrl)
})


res.send(newArr);

}


 function favioratehandler(req,res){
let email=req.query.email;
console.log(email);
chocoModel.find({email},function(err,data){
if(err){
    console.log('error in getting data');
}else{
    console.log(data);
    res.send(data)
}
})

}

async function deletehandler(req,res){
    let email=req.query.email;
    let id=req.params.id;

   await chocoModel.remove({_id:id},(err,deletedata)=>{
    if(err){
        console.log('error in deleteing data');
    }else{
        chocoModel.find({email},function(err,data){
        if(err){
            console.log('error in getting data');
        }else{
            res.send(data)
        }
        })
}
})
}
    
async function Addhandler(req,res){
   let {title,imageUrl,description,price}=req.body;
   console.log(price);
   let email=req.query.email;
   
  await chocoModel.create({title,imageUrl,description,price, email});
   chocoModel.find({email},function(err,data){
    if(err){
        console.log('error in getting data');
    }else{
        res.send(data)
    }
    })

    
    }

    async function updatehandler(req,res){
       
        let id=req.params.id;
        let {title,imageUrl,email}=req.body;
        
        chocoModel.findOne({_id:id},(error,selected)=>{

            selected.title=title;
            selected.imageUrl=imageUrl;
            selected.email=email;
          selected.save()
            .then(()=>{
                chocoModel.find({email},function(err,data){
                    if(err){
                        console.log('error in getting data');
                    }else{
                        res.send(data)
                    }
                    })


            })           
        })
    
    }

    
    class Choho  {
        constructor(id,title,price,description,imageUrl){
            this.id=id,
            this.title=title,
            this.price=price,
            this.description=description,
            this.imageUrl=imageUrl

       }
    }







server.listen (PORT,()=>console.log(`listening to PORT ${PORT}`))
