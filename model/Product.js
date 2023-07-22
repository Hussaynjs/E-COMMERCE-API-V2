const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        ref: 'Category'
    },
    sizes: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    colors: {
        type: [String],
        // required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String,
       required: true
    }],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            ref: 'Review'
        }
    ],
    price: {
        type: Number,
        required: true
    },
    totalQty:{
        type: Number,
        required: true
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0
    }
},{
    timestamps: true,
    toJSON: {virtuals: true}
})


productSchema.virtual('totalReviews').get(function(){
    return this.reviews.length
})

productSchema.virtual('averageRating').get(function(){


    let ratingTotal = 0;

     this?.reviews?.forEach((r) => {
       ratingTotal += r.rating
    })

    
    const averageRating = (ratingTotal / this.reviews.length)
    return averageRating

   
})
productSchema.virtual("quanttity-left").get(function(){
    
})
module.exports = mongoose.model('Product', productSchema)