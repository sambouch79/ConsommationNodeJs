const express=require('express')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
require('../db/mongoosedb')
const router=new express.Router()
  
 
 router.post('/users',async(req,res)=>{
     const user= new User(req.body)
     
     try {
         await user.save()
         const token=await user.generateAuthToken()
         res.status(201).send({user,token})
     } catch (error) {
         res.status(400).send(error)
     }
 })
 router.post('/users/login',async(req,res)=>{
  try {
      const user=await User.findByCredentials(req.body.email,req.body.password)
      const token=await user.generateAuthToken()
      res.send({user,token})
  } catch (error) {
      res.status(400).send(error)
  }

 })
 router.get('/users/me',auth,async(req,res)=>{
         res.status(200).send(req.user)
 })
 router.post('/users/logout',auth, async (req,res)=>{
     try {
        req.user.tokens=req.user.tokens.filter(token=>{
                return token.token!==req.token
            } )
        await req.user.save()
        res.send('ok')
     } catch (error) {
         res.status(500).send(error)
     }
 })

/*  router.get('/users/:id',auth,async(req,res)=>{
     const _id=req.params.id
      try {
          const user=await User.findById(_id)
          if(!user){
                return res.send(404).send()
          }
      res.status(200).send(user)
      } catch (error) {
         res.status(400).send(error)
      }
 }) */
 router.patch('/users/me',auth,async(req,res)=>{
     const updateField=Object.keys(req.body)
     const allowedUpdateField=['userName','email','password']
     const isValideUp=updateField.every((update)=>allowedUpdateField.includes(update))

     if(!isValideUp){
         res.status(400).send({error:'invalid update'})
     }
     try {
         updateField.forEach(update => req.user[update]=req.body[update]);
         await req.user.save()
         res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
 })
 router.delete('/users/me',auth,async(req,res)=>{
    
     try {
         const user=req.user
         user.remove()
        res.status(200).send(user)
     } catch (error) {
         res.status(400).send(error)
     }

 })
 module.exports=router

