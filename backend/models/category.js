const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  //represent the name of the category
  name: {
    type: String,
    required: true,
  },
  //represent the parent of the category
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  //represent the children of the category
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
}).set('toJSON', {
  virtuals: true, // add 'id' key in the result
  versionKey: false, // remove __v from the result
  transform: function (doc, ret) {
    delete ret._id; //remove _id from the result
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
