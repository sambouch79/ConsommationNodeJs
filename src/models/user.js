const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Consommation = require('../models/consommation')

const userSchema=new mongoose.Schema({
    userName:{
          type:String,
          required:true,
          minlength:6
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }

    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('invalid password') 
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
  
})
userSchema.virtual('consommations',{
    ref:'Consommation',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}
// create a method :methode accessible pour un specifique user
userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'signatureconsommation')
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}

//create a static method:methode statics accessible pour le modele User
userSchema.statics.findByCredentials=async(email,password)=>{
      const user =await User.findOne({email})
      if(!user){
          throw new Error('unable to login')
      }
      //verifier si le mot de pass correspond  au mot de password
      const isMatch=await bcrypt.compare(password,user.password)
      if(!isMatch){
        throw new Error('unable to login')
      }
    //req.user=user
    return user
}
//hash the password before saving
userSchema.pre('save',async function(next){
   const user=this
   if(user.isModified('password')){
     user.password=await bcrypt.hash(user.password,8)
   }
    next()
})
userSchema.pre('remove',async function(next){
    const user=this
    await Consommation.deleteMany({owner:user._id})
    next()

})
const User=mongoose.model('User',userSchema)
module.exports=User