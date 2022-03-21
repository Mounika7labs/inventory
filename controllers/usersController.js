const db = require('../db');
const ERROR_MESSAGE = require('../errorMessage.json');
const SUCCESS_MESSAGE = require("../successMessage.json");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const fastify = require('fastify')()
fastify.register(require('fastify-multipart'), { attachFieldsToBody: true })
const fs = require('fs-extra')
const path = require('path');
fastify.addContentTypeParser('*', function (request, payload, done) {
  done()
})



//Function to add user
exports.addUser = async (req, res) => {

 
  let  doc = {
      email: req.body.email,
      password: req.body.password,
      userStatus: 'active',
      isDeleted:0,
      tableName:"users",
      profilePic:  "img/users/user.png"

  }

  
    
    db.find({
        selector: {
            email: doc.email
        },
      }).then((getresult) =>{
          if(getresult.docs.length !==0){
            res.send({
                status: 400,
                message: ERROR_MESSAGE.ERROR_MESSAGE.USER_EXISTS
            })  
          }
          else{
            bcrypt.hash(doc.password, 10, (err, hash) => {
                if (err) throw err;
                doc.password = hash;
                db.post(doc).then(result => {
                    db.find({
                        selector: {
                          _id: result.id,
                        },
                     
                      })
                        .then((userdata) => {
                          jwt.sign(
                            { id: userdata.docs[0]._id },
                            process.env.REACT_APP_JWT_SECRET,
                            { expiresIn: 3 * 86400 },
                            (err, token) => {
                              if (err) throw err;
                      
                              res.send({
                                status: 200,
                              message: SUCCESS_MESSAGE.SUCCESS_MESSAGE.USER_LOGGEDIN,
                              data: userdata.docs[0],
                                token:token
                            })
                            }
                          );
                         
                        })
                })
                    .catch(err => {
                      console.log(err,"error");
                        res.send({
                            status: 400,
                            message: ERROR_MESSAGE.ERROR_MESSAGE.USER_NOT_ADDED
                        })
                    })
        
            })
          }

      })
}

//User Login
exports.login = (req, res) => {
    let password = req.body.password;

    db.find(
      {
        selector: {
          email: req.body.email
      },

      }).then((result) =>{
        if(result.docs.length === 0){
          res.send({
              status: 400,
              message: ERROR_MESSAGE.ERROR_MESSAGE.USER_NOT_EXISTS
          })  
        }
        else{
            $res = bcrypt.compare(password, result.docs[0].password)

            .then(isVerified => {
                if (isVerified) {

                  jwt.sign(
                    { id: result.docs[0]._id },
                    process.env.REACT_APP_JWT_SECRET,
                    { expiresIn: 3 * 86400 },
                    (err, token) => {
                      if (err) throw err;
              
                      res.send({
                        status: 200,
                        message: SUCCESS_MESSAGE.SUCCESS_MESSAGE.USER_LOGGEDIN,
                        data:result.docs[0],
                        token:token
                    })
                    }
                  );
              
                  
                }
                else {
                    res.send({
                        status: 401,
                        message: ERROR_MESSAGE.ERROR_MESSAGE.PASSWORD_INCORRECT,
                        password: 0
                    })
                }

            })
            .catch(err => console.log(err))
    }

        
    })
}





//add Bin
exports.addbin=async(req,res)=>{
  db.find({
    selector: {
        name:req.body.name,
        tableName:"bins"
        
    },
 
  }).then((result) =>{

      if(result.docs.length!==0){
          res.send({
            status:400,
            message:"bin already exists"
          })
      }
      else{
        let doc={
          name:req.body.name,
          note:req.body.note,
          createdDate: new Date(),
          tableName: 'bins',
      
        }
        db.post(doc, (err, data) => {
          if (err) {
            return console.log(err,"error");
          } else {
              if(data.ok){
                res.send({
                  status:200,
                  message:"Added bin succesfully"
      
                })
              }
        
              
          }
        });
      }
      }) 
      .catch(err=>{
        console.log(err);
      })
  }


 //get bins
 exports.getbins=async(req,res)=>{

  let getbinsdata = function(callback) {
    db.find({
      selector: {
          tableName:"bins"
      },
   
    }).then((result) =>{
      if(result.docs.length!==0){
        result.docs.map((data,i)=>{
          db.find({
            selector: {
                binid:data._id,
                tableName:"binitems"
            },
            fields:[
              "binid",
              "quantity"
            ]
         
          }).then((items) =>{
            var quantity = items.docs.reduce((accum,item) => accum + item.quantity, 0)
        
             result.docs[i]['itemscount'] = items.docs.length;
             result.docs[i]['totalquantity'] = quantity;
             if(i + 1 === result.docs.length){ 
              callback(result.docs);
  
            }
        
          }
          )
        
        
        })
      }
      else{
        callback([]);
      }
           
   
        }) 
        .catch(err=>{
          console.log(err);
        })
};

getbinsdata(function(data){
    res.send({
      status:200,
      rows:data
    })
  })


  }



  //add Item
exports.additem=async(req,res)=>{
  db.find({
    selector: {
        name:req.body.name,
        tableName:"items"
        
    },
 
  }).then((result) =>{

      if(result.docs.length!==0){
          res.send({
            status:400,
            message:"item already exists"
          })
      }
      else{
        let doc={
          binid:req.body.binid,
          name:req.body.name,
          quantity:req.body.quantity,
          items:req.body.items,
          createdDate: new Date(),
          tableName: 'binitems',
      
        }
        db.post(doc, (err, data) => {
          if (err) {
            return console.log(err,"error");
          } else {
              if(data.ok){
                res.send({
                  status:200,
                  message:"Item added succesfully"
      
                })
              }
        
              
          }
        });
      }
      }) 
      .catch(err=>{
        console.log(err);
      })
  }



  //get bin items
exports.getbinitems=async(req,res)=>{
  db.find({
    selector: {
        binid:req.params.binid,
        tableName:"binitems"
    },
 
  }).then((result) =>{
          res.send({
            status:200,
            rows:result.docs
          })
      }) 
      .catch(err=>{
        console.log(err);
      })
  }


  //Function to update bin item
exports.updateitem = (req, res) => {
  db.find({
    selector: {
        _id: req.body.id,
        tableName:"binitems"
        
    },
 
  }).then((result) =>{

    if(result.docs.length!==0){
      result.docs[0]['quantity'] = req.body.quantity;

      db.put(result.docs[0], (err, data) => {
        if (err) {
        return console.log(err,"error");
        } else {
         
          res.send({
            status:200,
            message:"Item upated successfully"
          })
      
        }  
        })

    }
    else{
      res.send({
        status:201,
        meessage:"no item exists"
      })
    }
   
    
      })  
  
}

  //Function to delete bin item
  exports.deleteitem = (req, res) => {

    db.find({
      selector: {
          _id: req.params.id,
          tableName:"binitems"
          
      },
   
    }).then((result) =>{
      if(result.docs.length!==0){
        db.remove(req.params.id,result.docs[0]._rev, (err, data) => {
          if(!err){
            res.send({
              status:200,
              message:"success"
            })
          }
          else{
            console.log(err);
          }
      })  
      }

      
    }
    )


  }


