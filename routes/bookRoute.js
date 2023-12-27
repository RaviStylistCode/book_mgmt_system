const express = require("express");
const { AddBook, UpdateBook, singleBook, deleteBook, updateComments, updateStock, addRating, AllBooks } = require("../controller/bookController");

const {isAuthenticated}= require("../middleware/Auth");
const router= express.Router();

router.route("/addbook").post(isAuthenticated,AddBook);
router.route("/updatebook/:id").put(isAuthenticated,UpdateBook);
router.route("/singlebook/:id").get(isAuthenticated,singleBook)
.delete(isAuthenticated,deleteBook);
router.route("/comments/:id").put(isAuthenticated,updateComments)
router.route("/stock/:id").put(isAuthenticated,updateStock)
router.route("/rate/:id").put(isAuthenticated,addRating);

router.route("/allbooks").get(isAuthenticated,AllBooks);

module.exports=router;