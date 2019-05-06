const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    facebook: {
          id: String,
          token: String,
          email: String, 
          name: String
    }
  });
  
// Export the model
module.exports = mongoose.model('User', UserSchema);