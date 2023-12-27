const express= require("express");
const { register, login, logout, deleteUser, updateprofile, getSingleUser, VerifiedUsers, UnverifiedUsers, allUsers, Profile, forgetpassword, resetpassword, verifyEmail } = require("../controller/userController");

const {isAuthenticated}= require("../middleware/Auth");

const router=express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated,logout);
router.route("/me").get(isAuthenticated,Profile);
router.route("/all").get(isAuthenticated,allUsers);

router.route("/:id")
.delete(isAuthenticated,deleteUser)
.get(isAuthenticated,getSingleUser);

router.route("/update-profile").put(isAuthenticated,updateprofile);

router.route("/verifyemail").post(isAuthenticated,verifyEmail);
router.route("/allverify").get(isAuthenticated,VerifiedUsers);
router.route("/allunverify").get(isAuthenticated,UnverifiedUsers);

router.route("/forget-password").post(forgetpassword);
router.route("/reset-password").post(resetpassword);

module.exports=router;