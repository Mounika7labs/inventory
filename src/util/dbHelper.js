import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import bcrypt from 'bcryptjs';
PouchDB.plugin(PouchDBFind);

const localDB = new PouchDB(process.env.REACT_APP_COUCH_DATABASE);
const remoteDB = new PouchDB(`${process.env.REACT_APP_COUCH_URL}/${process.env.REACT_APP_COUCH_DATABASE}`, {
  auth: {
    username: process.env.REACT_APP_COUCH_USERNAME,
    password: process.env.REACT_APP_COUCH_PASSWORD
  }
});
localDB.sync(remoteDB, function (err, response) {
  if (err) {
    return console.log("err");
  } else {
    // console.log(response, "add bin sync");
  }
});

const dbHelpers = {
  localDB: localDB,
  remoteDB: remoteDB,
  login: async function (doc) {

    return new Promise(resolve => {
      localDB.find({
        selector: {
          email: doc.email
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          bcrypt.compare(doc.password, result.docs[0].password)

            .then(isVerified => {
              if (isVerified) {
                resolve({
                  status: 200,
                  data: result.docs[0]
                })

              }
              else {
                resolve({ status: 401 })
              }
            })

        }
        else {
          resolve({ status: 400 })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },
  register: async function (doc) {

    return new Promise(resolve => {
      localDB.find({
        selector: {
          email: doc.email
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          resolve({ status: 400 })

        }
        else {
          bcrypt.hash(doc.password, 10, (err, hash) => {
            if (err) throw err;
            doc.password = hash;
            localDB.post(doc).then(result => {
              localDB.find({
                selector: {
                  _id: result.id,
                },

              })
                .then((userdata) => {
                  resolve({
                    status: 200,
                    data: userdata.docs[0]
                  })

                }
                )
            })
          })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },


  getBins: function () {

    return new Promise(resolve => {
      localDB.createIndex({
        index: {
          fields: ['createdDate']
        }
      }).then(function (result) {
      }).catch(function (err) {
      });
      localDB.find({
        selector: {
          tableName: "bins",
          createdDate: { $exists: true }
        },
        sort: [{ "createdDate": "desc" }],

      }).then((result) => {
        if (result.docs.length !== 0) {
          result.docs.map((data, i) => {
            localDB.find({
              selector: {
                binid: data._id,
                tableName: "binitems"
              },
              fields: [
                "binid",
                "quantity"
              ]

            }).then((items) => {
              var quantity = items.docs.reduce((accum, item) => accum + item.quantity, 0)
                console.log(items);
              result.docs[i]['itemscount'] = items.docs.length;
              result.docs[i]['totalquantity'] = quantity;
              if (i + 1 === result.docs.length) {

                localDB.sync(remoteDB, function (err, response) {
                  if (err) {
                    return console.log("err");
                  } else {
                    // console.log(response, "get bin sync");
                  }
                });
                resolve({
                  status: 200,
                  rows: result.docs
                });

              }

            }
            )


          })
        }
        else {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({
            status: 400,
            rows: []
          })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },



  addBin: async function (doc) {

    return new Promise(resolve => {
      localDB.find({
        selector: {
          name: doc.name,
          tableName: "bins"
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({ status: 400 })
        }
        else {
          localDB.post(doc, function (err, response) {
            console.log(err, response);
            if (err) {
              return console.log("err");
            } else {
              if (response.ok) {
                localDB.sync(remoteDB, function (err, response) {
                  if (err) {
                    return console.log(err);
                  } else {
                    // console.log(response, "add bin sync");
                  }
                });
                resolve({ status: 200 })
              }




            }
          })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },
  addBinItem: async function (doc) {
    return new Promise(resolve => {
      localDB.find({
        selector: {
          name: doc.name,
          tableName: "items"
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({ status: 400 })
        }
        else {
          localDB.post(doc, function (err, response) {
            if (err) {
              return console.log(err);
            } else {
              localDB.sync(remoteDB, function (err, response) {
                if (err) {
                  return console.log("err");
                } else {
                  // console.log(response, "add bin sync");
                }
              });
              resolve({ status: 200 })
            }
          })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },

  getBinItems: function (doc) {

    return new Promise(resolve => {
      localDB.createIndex({
        index: {
          fields: ['createdDate']
        }
      }).then(function (result) {
      }).catch(function (err) {
      });
      localDB.find({
        selector: {
          binid: doc.binid,
          tableName: "binitems",
          createdDate: { $exists: true }
        },
        sort: [{ "createdDate": "desc" }],

      }).then((result) => {
        if (result.docs.length !== 0) {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({
            status: 200,
            rows: result.docs
          });
        }
        else {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({
            status: 400,
            rows: []
          })
        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },
  updateBinItem: async function (doc) {

    return new Promise(resolve => {
      localDB.find({
        selector: {
          _id: doc.id,
          tableName: "binitems"
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          result.docs[0]['quantity'] = doc.quantity;

          localDB.put(result.docs[0], (err, data) => {
            if (err) {
              return console.log(err, "error");
            } else {
              localDB.sync(remoteDB, function (err, response) {
                if (err) {
                  return console.log("err");
                } else {
                  // console.log(response, "add bin sync");
                }
              });
              resolve({ status: 200 })

            }
          })
        }
        else {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({ status: 400 })

        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },
  deleteBinItem: async function (doc) {

    return new Promise(resolve => {
      localDB.find({
        selector: {
          _id: doc.id,
          tableName: "binitems"
        },

      }).then((result) => {
        if (result.docs.length !== 0) {
          localDB.remove(doc.id, result.docs[0]._rev, (err, data) => {
            if (!err) {
              localDB.sync(remoteDB, function (err, response) {
                if (err) {
                  return console.log("err");
                } else {
                  // console.log(response, "add bin sync");
                }
              });
              resolve({ status: 200 })
            }
            else {
              console.log(err);
            }
          })
        }
        else {
          localDB.sync(remoteDB, function (err, response) {
            if (err) {
              return console.log("err");
            } else {
              // console.log(response, "add bin sync");
            }
          });
          resolve({ status: 400 })

        }
      })
        .catch(err => {
          console.log(err);
        })
    });
  },






};

export default dbHelpers;