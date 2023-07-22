const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50
    },
   email: {
        type: String,
        required: [true, 'please provide email'],
        validate:{
            validator: validator.isEmail,
            message: 'please provide a valid email'
        }
        
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
       
    },
    orders: [
        {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Order'
        }
    ],

    wishLists: [
        {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'WhisList'
        }
    ],
    isAdmin: {
       type: Boolean,
       default: false
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    hasShippingAddress:{
        type: Boolean,
        default: false
    },
    shippingAddress: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        address: {
            type: String
        },
        phone: {
            type: Number
        },
        postalCode: {
            type: String
        },
        city:{
            type: String
        },
        province: {
            type: String
        },
        country: {
            type: String
        }
    },
    
    
},{
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.methods.confirmPassword = async function(candidatesPassword){

    const isMatch = await bcrypt.compare(candidatesPassword, this.password)

    return isMatch
}

module.exports = mongoose.model('User', userSchema)

