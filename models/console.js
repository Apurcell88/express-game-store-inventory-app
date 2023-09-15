const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  game: [{ type: Schema.Types.ObjectId, ref: 'Game'}]
});

// Virtual for console's URL
ConsoleSchema.virtual('url').get(function () {
  return `/catalog/console/${this._id}`;
});

// Export model
module.exports = mongoose.model('Console', ConsoleSchema);