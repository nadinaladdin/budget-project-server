const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true,
        trim: true
    },
    colour: {
        type:  String,
        required: [true, 'A category must have a colour'],
        trim: true
    }   
    },
    {
        toJSON: { virtuals: true },
    }   
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;