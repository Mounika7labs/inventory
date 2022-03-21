
//User Controller

const usersController = require("../controllers/usersController");
const verifyToken = require('../controllers/auth/verifyToken')
const {
  loginSchema,
  getHeaders,
  getIdandRev,
  addBinSchema,
  addItemSchema,
  getBinItemsSchema,
  updateItemSchema



} = require('../controllers/schemas/users.js');

const login = {
  schema: loginSchema,
  handler: usersController.login,
};



const addbin={
  schema:addBinSchema,
  handler:usersController.addbin
}

const additem={
  schema:addItemSchema,
  handler:usersController.additem
}


const getbins={
  schema:getHeaders,
  handler:usersController.getbins
}

const getBinItems={
  schema:getBinItemsSchema,
  handler:usersController.getbinitems
}

const updateItem={
  schema:updateItemSchema,
  handler:usersController.updateitem
}

const deleteBinItem={
  schema:getIdandRev,
  handler:usersController.deleteitem
}



async function routes (fastify, options,done) {

    fastify.register(require('fastify-multipart'), { attachFieldsToBody: true })
    fastify.post('/api/user', usersController.addUser);
    fastify.post('/api/login',login);

  fastify.register(require('fastify-auth')).after(() => privateRoutes(fastify));

  done();
   
   



}

async function privateRoutes (fastify, options) {
  fastify.post('/api/addbin',{preHandler: fastify.auth([verifyToken]),...addbin})
  fastify.get('/api/getbins',{preHandler: fastify.auth([verifyToken]),...getbins})
  fastify.post('/api/addbinitem',{preHandler: fastify.auth([verifyToken]),...additem})
  fastify.post('/api/updatebinitem',{preHandler: fastify.auth([verifyToken]),...updateItem})
  fastify.get('/api/getbinitems/:binid',{preHandler: fastify.auth([verifyToken]),...getBinItems})
  fastify.get('/api/deletebinitem/:id/:rev',{preHandler: fastify.auth([verifyToken]),...deleteBinItem})
   
}

module.exports = routes;