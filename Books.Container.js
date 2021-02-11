'use strict';

const fs = require('fs');
const logger = require('./logger');
const BookModel =  require('./model/Book');
var bookMap =  new Map();
var is_dirty = false;

class BookContainer{

    static addBook(bookID, book){
        bookMap.set(bookID, book)
    }

    static getBook(bookID){
        return bookMap.get(bookID);
    }

    static removeBook(bookID){
        bookMap.delete(bookID);
    }

    static save(){
       if(!BookContainer.isModified()){
            return;
       }
       logger.info('saving books from workbook');
       var books =  BookContainer.toJSON();
       BookContainer.setModified(false);
       fs.writeFileSync('./store/library.json', JSON.stringify(books, null, 2)); 
    }

    static parse(){
        bookMap.clear();
        const rawdata = fs.readFileSync('./store/library.json', {encoding:'utf8', flag:'r'}); 
        let books = JSON.parse(rawdata);
        for(let bookJSON of books){
            var bookObj = BookModel.parse(bookJSON);
            BookContainer.addBook(bookObj.getID(), bookObj);
        }
    }

    static toJSON(){
        var books = [];
        for (let book of bookMap.values()) {
            books.push(book.toJSON());
        }
        return books;
    }

    static setModified(mode){
        is_dirty = mode;
    }

    static isModified(){
        return is_dirty;
    }
}

module.exports = BookContainer;
