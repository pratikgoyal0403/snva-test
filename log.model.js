const mongoose = require("mongoose");

const Log = new mongoose.Schema({
  request: [
    {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  ],
  response: [
    {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("api_logs", Log);
