const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let sameName = users.filter((user) =>{
        return user.username === username
    })
    if(sameName.length>0){
        return true;
    }
    else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUsers = users.filter((user) =>{
    return (user.username===username && user.password===password)
})
if(validUsers.length>0){
    return true
}
else{
    return false;
}
}
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if(!username && !password){
        return res.status(404).json({message:"Error logging in"})

    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data: password,

        },'access',{expiresIn: 60*60});
        req.session.authorization = {accessToken,username}
    
    return res.status(200).send("Userr succcessfully logged in")
}
else{
    return res.status(208).json({message: "Invalid login. Check username and password"})
}
});


// regd_users.post("/register", (req,res) =>{
//     const username = req.body.username
//     const password = req.body.password

//     if(username && password){
//         if(!isValid(username)){
//             users.push({"username":username, "password":password});
//             return res.status(200).json({message: "User successfully registred. Now you can login"});
//         }
//         else{
            
//       return res.status(404).json({message: "User already exists!"});    
//         }
//     }
//     return res.status(404).json({message: "Unable to register user."});
// })



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbnToUpdate = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.session.authorization?.username;

  // Check if the request contains both the review text and the username
  if (!reviewText || !username) {
    return res.status(400).json({ message: "Please provide both the review text and username in the request query." });
  }

  // Find the book with the specified ISBN
  const bookToUpdate = books[isbnToUpdate];

  if (!bookToUpdate) {
    return res.status(404).json({ message: "Book with the specified ISBN not found" });
  }

  // Find the review for the current user, if any
  const existingReview = bookToUpdate.reviews[username];

  // If the user has already posted a review, modify it
  if (existingReview) {
    existingReview.review = reviewText;
  } else {
    // If the user hasn't posted a review, add a new review
    bookToUpdate.reviews[username] = { review: reviewText };
  }

  return res.status(200).json({ message: `Review ${reviewText}  added/modified successfully` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbnToDelete = req.params.isbn;
  const username = req.session.authorization?.username;

  // Check if the request contains the session username
  if (!username) {
    return res.status(400).json({ message: "Please provide the username in the request query." });
  }

  // Find the book with the specified ISBN
  const bookToUpdate = books[isbnToDelete];

  if (!bookToUpdate) {
    return res.status(404).json({ message: "Book with the specified ISBN not found" });
  }

  // Find the review for the current user, if any
  const existingReview = bookToUpdate.reviews[username];

  // If the user has posted a review, delete it
  if (existingReview) {
    delete bookToUpdate.reviews[username];
    return res.status(200).json({ message: `Review with isbn ${isbnToDelete} deleted successfully` });
  } else {
    return res.status(404).json({ message: "Review not found for the specified user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
