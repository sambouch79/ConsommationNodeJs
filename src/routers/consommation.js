const express=require('express')
const auth=require('../middleware/auth')
const Consommation=require('../models/consommation')
require('../db/mongoosedb')
const router=new express.Router()

router.post('/consommation',auth,async(req,res)=>{
    const consommation=new Consommation({
        ...req.body,
        owner:req.user._id
    })
    try {
        await consommation.save()
        res.status(201).send(consommation)  
    } catch (error) {
      res.status(400).send(error)  
    }
})
router.get('/consommation',auth,async(req,res)=>{
    try {
        const consommations=await req.user.populate('consommations').execPopulate()
        res.status(200).send(consommations)
        
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/consommation/:id',auth,async(req,res)=>{
  const _id=req.params.id
    try {
        const consommation=await Consommation.findOne({_id, owner:req.user._id})
        if(!consommation){
            return res.status(400).send()
        }
        res.status(200).send(consommation)
        
    } catch (error) {
        res.status(400).send(error)
    }
})
router.patch('/consommation/:id',auth,async(req,res)=>{
    const updateField=Object.keys(req.body)
    const allowedUpdateField=['electricityHP','electricityHC','gaz','eau','date']
    const IsvalideUp=updateField.every((update)=>allowedUpdateField.includes(update))
    if(!IsvalideUp){
        return res.status(400).send()
    }
    try {
        const consommation=await Consommation.findOne({_id:req.params.id, owner:req.user._id})
       
        //const consommation=await Consommation.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!consommation){
            return res.status(400).send()
        }
        updateField.forEach((update)=>consommation[update]=req.body[update])
        await consommation.save()
        res.status(200).send(consommation)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/consommation/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try {
        const consommation=await Consommation.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(400).send()
        }
     
        res.send(consommation)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports=router