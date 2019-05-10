const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var StatementSchema = new Schema({
    statement: {
          id: String,
          name: String,
          date: String, 
          info: String
    }
  });
  
// Export the model
module.exports = mongoose.model('Statement', StatementSchema);