//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB");


const articleSchema = {
  title: String,
  content: String
};


const Article = mongoose.model("Article", articleSchema);

/////////Requests targetting all articles

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        // console.log(foundArticles);
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Success!");
      } else {
        res.send(err);
      }
    });
  })



  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/////////Requests targetting a specific article



app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title: req.params.articleTitle},function(err,articleFound){
    if(articleFound){
      res.send(articleFound);
    }
    else{
      res.send("No article found!");
    }
  });
})


.put(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated!");
      }
    }
  );
})



.patch(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set: req.body},

    function(err){
      if(!err){
        res.send("Successfully updated article!");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if(!err){
      res.send("Article deleted Successfully!");
    }
  else{
    res.send(err);
  }
  });
});


app.listen(3000, function() {
  console.log("Server started at port 3000");
});









// [
//     {
//         "_id": "62ffee726bd67e0810a62640",
//         "title": "REST",
//         "content": "REST is short for REpresentational State Transfer. Its an architectural style for designing APIs."
//     },
//     {
//         "_id": "5c139771d79ac8eac11e754a",
//         "title": "API",
//         "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
//     },
//     {
//         "_id": "5c1398aad79ac8eac11e7561",
//         "title": "Bootstrap",
//         "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
//     },
//     {
//         "_id": "5c1398ecd79ac8eac11e7567",
//         "title": "DOM",
//         "content": "The Document Object Model is like an API for interacting with our HTML"
//     },
//     {
//         "_id": "630074cbf714c0e8cdef49c5",
//         "title": "Handle Post requests without htmlcssjs",
//         "content": "This can be done through postman which will send a post request to our API and send the pieces of information typically a user sends when making a post request.",
//         "__v": 0
//     }
// ]
