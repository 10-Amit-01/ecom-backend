import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email }, accessToken });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, accessToken });
}

export async function googleAuth(req, res) {
    const user = req.user;
    if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=true`);
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.profilePicture || user.image
    }));

    res.redirect(`${process.env.FRONTEND_URL}/google/callback?accessToken=${accessToken}&user=${userData}`);
}

export async function logout(req, res) {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}

export async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.status(200).json({ accessToken });
    } catch {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
}