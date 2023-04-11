const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    masp: {
        type: String,
        required: true
    },
    namePro: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imagePro: {
        type: String,
        
    },
    colorPro: {
        type: String,
        
    }
});

const productModel = mongoose.model('product', productsSchema);

module.exports = productModel;