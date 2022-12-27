const mongoose = require("mongoose");
async function connect_db() {
  try {
    const connected = await mongoose.connect(
      "mongodb+srv://suryakodnest:2146255sb8@suryacluster.orspo7s.mongodb.net/authentication"
    );
    return connected;
  } catch (e) {
    console.log(e);
    return false;
  }
}
module.exports = connect_db;
