const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if(username && password){
        if(!isValid(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        }
        else{
            
      return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



    
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      // Simulate a delay to mimic an asynchronous operation (you can remove this in the actual server)
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const book = books[isbn];
      if (book) {
        res.send(book);
      } else {
        res.status(404).json({ message: 'Book with the specified ISBN not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    const author = req.params.author;
  
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const matchingBooks = Object.values(books).filter(book => book.author === author);
  
      if (matchingBooks.length > 0) {
        res.send(matchingBooks);
      } else {
        res.status(404).json({ message: 'No books found for the specified author' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    const title = req.params.title;
  
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const matchingBooks = Object.values(books).filter(book => book.title === title);
  
      if (matchingBooks.length > 0) {
        res.send(matchingBooks);
      } else {
        res.status(404).json({ message: 'No books found for the specified title' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.body.isbn
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    if (Object.keys(book.reviews).length === 0) {
        return res.status(200).json(book.reviews)
    } else {
      return res.status(200).json(book.reviews);
    }
  }
  return res.status(404).json({ message: "Book with the specified ISBN not found." });

});

module.exports.general = public_users;
