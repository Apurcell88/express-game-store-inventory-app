const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  system: { type: String, required: true},
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

// Virtual for game's URL
GameSchema.virtual('url').get(function () {
  return `/catalog/game/${this._id}`;
});

// Export model
module.exports = mongoose.model('Game', GameSchema);