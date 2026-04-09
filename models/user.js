import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        // required: [true, "Password is required"],
        trim: true,
        // min: [8, "Password must be at least 8 characters long"]
    },
    googleId: {
        type: String,
        unique: true,
    },
    profilePicture: {
        type: String,
        trim: true
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;