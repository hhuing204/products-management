
const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 60
    }
}, {
    timestamps: true
})

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-passwords")

module.exports = ForgotPassword