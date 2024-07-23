const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/password_management_system')
var conn = mongoose.connection

// console.log(conn)
var UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        index:{
            unique:true
        }
    },
    email: {
        type:String,
        required: true,
        index:{
            unique:true
        }
    },

    password: {
        type:String,
        required: true,
        index:{
            unique:true
        }
    },

    date:{
        type: Date,
        default: Date.now
    }
    
});
var userModel = mongoose.model('pms',UserSchema)
module.exports = userModel