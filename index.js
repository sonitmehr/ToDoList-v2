//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const e = require("express");
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sonitmehrotra2021:Test123@sexytoes.izvkiad.mongodb.net/toDoListDB");

const itemSchema = {
    name : String
};

const Item = mongoose.model("Item",itemSchema);

const buyFood = new Item({name : "Buy Food"});
const cookFood = new Item({name : "Cook Food"});
const eatFood = new Item({name : "Eat Food"});

// Item.insertMany([buyFood,cookFood,eatFood]);
// const items = ["Buy Food", "Cook Food", "Eat Food"];

const listItem = {
  name : String,
  items : [itemSchema]
};

const List = mongoose.model("list",listItem);
app.get("/", function(req, res) {
  
  Item.find().then((data) => {
    if(data.length == 0){
      Item.insertMany([buyFood,cookFood,eatFood]);
      res.redirect("/");
    }
    
    else res.render("list", {listTitle: "Today", newListItems: data});
    
    
  });
  

});

app.post("/", function(req, res){

  const newItem = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name : newItem
  });
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name : listName}).then((data) => {
        data.items.push(item);
        data.save();
        res.redirect("/" + listName);
    });
    
  }
  

});
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
   
  if(listName == "Today"){
    Item.findByIdAndRemove({_id : checkedItemId}).then();
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name : listName},{$pull : {items : {_id : checkedItemId}}}).then((data)=>{
        res.redirect("/" + listName);
    });
  }

  
});
app.get("/:title", function(req,res){
    const customListName =  _.capitalize(req.params.title);
    
    List.findOne({name : customListName}).then((data) => {
      // console.log(data);  
      if(data == null){
          const list = new List({
            name : customListName,
            items : [buyFood,cookFood,eatFood]
          });
          list.save();
          res.redirect("/" + customListName);
        }
        else {
          res.render("list",{listTitle : customListName,newListItems : data.items});
        }
    })
    
    

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
