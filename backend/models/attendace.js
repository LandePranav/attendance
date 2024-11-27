const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Base64-encoded string
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
