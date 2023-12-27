const asyncError = require("../middleware/asyncError");
const Book = require("../models/bookModel");


// AddBooks
exports.AddBook=asyncError(async(req,res)=>{

    const {name,title,description,stock}=req.body;
    const book = await Book.create({
        name,
        title,
        description,
        stock,
        user:req.user._id
    });


    res.status(200).json({
        success:true,
        message:"Book Added Successfully",
        book
    })
})

// Book Update

exports.UpdateBook= asyncError(async(req,res)=>{

    let book = await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    book= await Book.findByIdAndUpdate(req.params.id,req.body,{new:true});

    res.status(200).json({
        success:true,
        message:"Book Updated successfully",
        book
    });

})


// Book Deleted By Id

exports.deleteBook= asyncError(async(req,res)=>{

    const book = await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    await book.deleteOne();
    res.status(200).json({
        success:true,
        message:"Book deleted successfully"
    });

})


// all Book ;

exports.AllBooks= asyncError(async(req,res)=>{

    const book = await Book.find();
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"All Books ",
        book
    })
})

// single Book Details

exports.singleBook= asyncError(async(req,res)=>{

    const {id}=req.params;
    const book= await Book.findById(id).populate("user","name email");
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"Book Found",
        book
    });

})


// Update Stock
exports.updateStock = asyncError(async(req,res)=>{

    const qty=Number(req.body.stock);
    let book= await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    book.stock +=qty;
    await book.save();

    res.status(200).json({
        success:true,
        message:"stock updated successfullly"
    });


})

// update comments

exports.updateComments= asyncError(async(req,res)=>{

    const {comment}=req.body;
    let book= await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }

    const data={
        userId:req.user._id,
        comment
    }

    book.comments.push(data);
    await book.save();

    res.status(200).json({
        success:true,
        message:"comment Added",
        book
    })
})

// Add Rating

exports.addRating = asyncError(async(req,res)=>{

    const rate=Number(req.body.rating);
    let book = await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book not found"
        });
    }


    book.rating += rate;
    await book.save();
    res.status(200).json({
        success:true,
        message:"Rating Added",
        book
    })
})