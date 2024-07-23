const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2');

mongoose.connect('mongodb://localhost:27017/password_management_system')
var conn = mongoose.connection

// console.log(conn)
var passDetailsSchema = new mongoose.Schema({
    pass_category: {
        type:String,
        required: true,
        index:{
            unique:true
        }
        
    },

    project_name:{
        type: String
    },
    
    password_detail: {
        type:String
    },


    date:{
        type: Date,
        default: Date.now
    }
    
});
passDetailsSchema.plugin(mongoosePaginate);

var passDetailsModel = mongoose.model('password_details',passDetailsSchema)
module.exports = passDetailsModel