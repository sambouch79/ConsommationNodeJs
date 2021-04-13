const mongoose=require('mongoose')
const validator=require('validator')

const consommationSchema=new mongoose.Schema({
       electricityHC:{
           type:Number,
           trim:true,
           required:true

       },
       electricityHP:{
           type:Number,
           trim:true,
           required:true
       },
       eau:{
           type:Number,
           trim:true,
           required:true
       },
       gaz:{
           type:Number,
           trim:true,
           required:true
       },
       date:{
           type:Date,
           default:Date.now()
       },
       owner:{
           type:mongoose.Schema.Types.ObjectId,
           required:true
       }
})
consommationSchema.pre('save',async function(next){
    const consommation=this
   
     next()
 })
const Consommation=mongoose.model('Consommation',consommationSchema)
module.exports=Consommation