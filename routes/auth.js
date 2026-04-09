import { Router } from "express";
import passport from "passport";

import authMiddleware from "../middleware/authmiddlware.js";
import { registerUser, login, logout, refreshToken, googleAuth } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { userRegisterSchema, userLoginSchema } from "../validation/index.js";

const router = Router();

router.post("/register", validate(userRegisterSchema), registerUser);
router.post("/login", validate(userLoginSchema), login);
router.post("/logout", authMiddleware, logout);
router.post("/refreshToken", authMiddleware, refreshToken);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL + '/login?error=true' }),
    googleAuth
);

export default router;