const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/password_management_system')
var conn = mongoose.connection

// console.log(conn)
var passcatSchema = new mongoose.Schema({
    password_category: {
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
var passcatModel = mongoose.model('password_category',passcatSchema)
module.exports = passcatModel