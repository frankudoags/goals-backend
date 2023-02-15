import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../db/models/userModel";
import { BadRequest, Unauthorized, UserAlreadyExists } from "../utils/errors";
import { sign, Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/random";
import crypto from "crypto";
import Token from "../db/models/tokenModel";

/**
 * @description signup a new user
 * @param req
 * @param res
 * @route  POST api/users/signup
 * @access Public
 * @returns {Promise<{void}>}
 */
export const signupHandler = asyncHandler(
  async (req: Request, res: Response) => {
    //destructure req.body and get name, email and password
    const { name, email, password } = req.body;
    //error handling, check if all fields are filled and throw error if not
    if (!name || !email || !password) {
      res.status(400);
      throw new BadRequest("Please fill in all fields");
    }
    //check if user exists in db and throw error if they do
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new UserAlreadyExists(`${email} already exists`);
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    //return user data if user is created successfully, else throw error
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400);
      throw new BadRequest("Invalid user data");
    }
  }
);//done

/**
 * @description login a user
 * @param req
 * @param res
 * @route  POST api/users/login
 * @access Public
 * @returns {Promise<void>}
 */
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //error handling
    if (!email || !password) throw new BadRequest("Please fill in all fields");
    //check if user exists in db
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400);
      throw new BadRequest("User with this email does not exist");
    }
    //if user exists, compare password
    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
      });
    }
    //if password is incorrect, throw error
    else {
      res.status(401);
      throw new Unauthorized("Password is incorrect");
    }
  }
);//done

/**
 * @description get current logged in user details
 * @param req
 * @param res
 * @route  GET api/users/me
 * @access Private
 * @returns {Promise<void>}
 */
export const getMeHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    //get user details from req.user
    const user = req.user;
    //return user details
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }
); //done

/**
 * @description logout a user
 * @param req
 * @param res
 * @route  GET api/users/logout
 * @access Public
 * @returns {Promise<void>}
 */
export const logoutHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    //get user details from req.user
    const user = req.user;
    //log user out by deleting token from db
    user.token = destroyToken(user._id);
    await user.save();
    //return success message
    res.status(200).json({ success: true, message: "Logout successful" });
  }
);

/**
 * @description forgot password endpoint for user that forgot their password
 * @param req
 * @param res
 * @route  POST api/users/forgotpassword
 * @access Public
 * @returns {Promise<void>}
 */
export const forgotPasswordHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    //get user email from req.body
    const { email } = req.body;
    //check if user exists in db
    const user = await User.findOne({ email });
    //if user exists, generate reset token, if token exists, delete it and generate a new one
    if (user) {
      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();

      //generate reset token from crypto random bytes and hash it with bcrypt
      const resetToken = await bcrypt.hash(
        crypto.randomBytes(20).toString("hex"),
        10
      );
      await new Token({
        userId: user._id,
        token: resetToken,
        createdAt: Date.now(),
      }).save();
      //send email with reset token to user
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/users/resetpassword/${resetToken}`;

      try {
        //send email to user with reset link
        // await sendEmail(email, resetUrl, user.name);
        res
          .status(200)
          .json({ success: true, data: "Email sent", link: resetUrl });
      } catch (error) {
        res.status(500);
        throw new BadRequest("Email could not be sent");
      }
    } else {
      res.status(404);
      throw new BadRequest("User with this email does not exist");
    }
  }
);

/**
 * @description reset password endpoint for user that forgot their password
 * @param req
 * @param res
 * @route  POST api/users/resetpassword/:resettoken
 * @access Public
 * @returns {Promise<void>}
 */
export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    //get reset token from req.params
    const resetToken = req.params.resettoken;

    //check if token exists in db
    const token = await Token.findOne({ token: resetToken });
    if (!token) {
      res.status(400);
      throw new BadRequest("Invalid token");
    }
    //check if token is expired
    const isValid = token.createdAt.getTime() + 3600000 < Date.now();
    if (!isValid) {
      res.status(400);
      throw new BadRequest("Reset Token expired");
    } else {
      //token is not expired, get user attached to token and update password
      const user = await User.findById(token.userId);
      if (!user) {
        res.status(400);
        throw new BadRequest("Invalid token");
      } else {
        const salt = await bcrypt.genSalt(10);
        const pass = crypto
        const hashedPassword = await bcrypt.hash("0000", salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
          message:
            "Password reset successful, check your mail for your new password",
          success: true,
        });
      }
    }
  }
);

/**
 * @description update password endpoint for user that forgot their password
 * @param req
 * @param res
 * @route  POST api/users/updatepassword
 * @access Public
 * @returns {Promise<void>}
 */
export const updatePasswordHandler = asyncHandler(
  async (req: Request | any, res: Response) => {
    //get user from req.user
    const user = req.user;
    const { email } = user;
    //get user password from req.body
    const { oldpassword, newpassword } = req.body;
    if (!newpassword || !oldpassword) {
      res.status(400);
      throw new BadRequest("Please fill in all fields");
    }
    //check old password against password in db
    const dbuser = await User.findOne({ email }).select("+password");
    if (dbuser && (await bcrypt.compare(oldpassword, dbuser.password))) {
      //hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      //update user password
      dbuser.password = hashedPassword;
      await dbuser.save();
      res.status(200).json({ success: true, message: "Password updated" });
    } else {
      res.status(401);
      throw new Unauthorized("Old password is incorrect");
    }
  }
);

//Generate jwt token
const generateToken = (id: string) => {
  return sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//destroy jwt token and invalidate user jwt
const destroyToken = (id: string) => {
  return sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: 0,
  });
};
