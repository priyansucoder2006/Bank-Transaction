const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is Required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Invalid Email"
            ],
            unique: true
        },

        name: {
            type: String,
            required: [true, "Name is required for creating an account"],
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password should contain minimum 6 characters"],
            select: false
        },
        systemUser:{
            type:Boolean,
            default:false,
            immutable:true
        }

    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
