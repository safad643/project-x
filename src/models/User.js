 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, 
    default: '',  
  },
  phone: {
    type: String,
    
  },
  email_verifired:{
    type:Boolean,
    default:false
  },

  isActive:{
 type:Boolean,
 default:true
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('User', userSchema);
