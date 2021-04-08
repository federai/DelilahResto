const controller = require('../controllers/controller');
const middlewares = require('../controllers/middlewares');
const express = require('../controllers/express');
const bodyParser = require('body-parser');
const successResponse = require('../models/successResponse');
const errorResponse = require('../models/errorResponse');


controller.startAPI();


//Middlewares
express.server.use(middlewares.checkDatabaseConnection);
express.server.use(bodyParser.json());


//Sign up
express.server.post('/v1/sign-up', middlewares.checkSignUpPayloadStructure, middlewares.checkSignUpRequiredDataWasSent,
  middlewares.checkIfUserRoleIsValid, middlewares.checkIfUsernameAlreadyExists, middlewares.checkIfUserEmailAlreadyExists, async (req, res) => {
    try {
      await controller.createUser(req.body);
      let response = new successResponse('User successfully created');
      res.status(200).json(response);
    } catch (error) {
      let response = new errorResponse('Unable to create user', error);
      res.status(500).json(response);
    }
  });

//Login
express.server.post('/v1/login', middlewares.checkLoginPayloadStructure, middlewares.checkLoginRequiredDataWasSent, async (req, res) => {
  try {
    let jwt = await controller.athenticateUser(req.body);
    res.status(200).json({
      description: 'User successfully authenticated',
      jwt: jwt
    });
  } catch (error) {
    let response = new errorResponse('Unable to authorize user', error.message);
    res.status(500).json(response);
  }
});

//Users
express.server.get('/v1/users', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, async (req, res) => {
  try {
    let users = await controller.getUsers();
    res.status(200).json(users);
  } catch (error) {
    let response = new errorResponse('Unable to fetch users', error.message);
    res.status(500).json(response);
  }
});

express.server.get('/v1/users/:username', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkIfUserExists, async (req, res) => {
  try {
    let users = await controller.getUser(req.params.username);
    res.status(200).json(users);
  } catch (error) {
    let response = new errorResponse('Unable to fetch user', error.message);
    res.status(500).json(response);
  }
});

//Products
express.server.post('/v1/products', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkCreateProductPayloadStructure,
  middlewares.checkCreateProductRequiredDataWasSent, middlewares.checkIfProductAlreadyExists, async (req, res) => {
    try {
      await controller.createProduct(req.body);
      let response = new successResponse('Product successfully created');
      res.status(200).json(response);
    } catch (error) {
      let response = new errorResponse('Unable to create product', error);
      res.status(500).json(response);
    }
  });

express.server.get('/v1/products', middlewares.authorizeUser, async (req, res) => {
  try {
    let products = await controller.getProducts();
    res.status(200).json(products);
  } catch (error) {
    let response = new errorResponse('Unable to fetch products', error.message);
    res.status(500).json(response);
  }
});

express.server.get('/v1/products/:productId', middlewares.authorizeUser, middlewares.checkIfProductExists, async (req, res) => {
  try {
    let product = await controller.getProduct(req.params.productId);
    res.status(200).json(product);
  } catch (error) {
    let response = new errorResponse('Unable to fetch product', error.message);
    res.status(500).json(response);
  }
});

express.server.get('/v1/products/users/:username', middlewares.authorizeUser, middlewares.checkIfUserExists, async (req, res) => {
  try {
    let products = await controller.getUserFavoriteProducts(req.params.username);
    res.status(200).json(products);
  } catch (error) {
    let response = new errorResponse('Unable to fetch user\'s products', error.message);
    res.status(500).json(response);
  }
});

express.server.put('/v1/products/:productId', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkCreateProductPayloadStructure,
  middlewares.checkCreateProductRequiredDataWasSent, middlewares.checkIfProductExists, async (req, res) => {
    try {
      await controller.updateProduct(req.params.productId, req.body);
      let response = new successResponse('Product successfully updated');
      res.status(200).json(response);
    } catch (error) {
      let response = new errorResponse('Unable to update product', error.message);
      res.status(500).json(response);
    }
  });

express.server.delete('/v1/products/:productId', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkIfProductExists, async (req, res) => {
  try {
    await controller.deleteProduct(req.params.productId);
    let response = new successResponse('Product successfully deleted');
    res.status(200).json(response);
  } catch (error) {
    let response = new errorResponse('Unable to delete product', error.message);
    res.status(500).json(response);
  }
});

//Orders
express.server.post('/v1/orders', middlewares.authorizeUser, middlewares.checkIfUserInOrderExists, middlewares.checkIfProductsInOrderExist, async (req, res) => {
  try {
    await controller.createOrder(req.body);
    let response = new successResponse('Order successfully created');
    res.status(200).json(response);
  }
  catch (error) {
    let response = new errorResponse('Unable to create order', error);
    res.status(500).json(response);
  }
});

express.server.get('/v1/orders', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, async (req, res) => {
  try {
    let orders = await controller.getOrders();
    res.status(200).json(orders);
  } catch (error) {
    let response = new errorResponse('Unable to fetch orders', error.message);
    res.status(500).json(response);
  }
});

express.server.get('/v1/orders/:orderId', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkIfOrderExists, async (req, res) => {
  try {
    let orders = await controller.getOrder(req.params.orderId);
    res.status(200).json(orders);
  } catch (error) {
    let response = new errorResponse('Unable to fetch order', error.message);
    res.status(500).json(response);
  }
});

express.server.get('/v1/orders/users/:username', middlewares.authorizeUser, middlewares.checkIfUserExists, async (req, res) => {
  try {
    let orders = await controller.getUserOrders(req.params.username);
    res.status(200).json(orders);
  } catch (error) {
    let response = new errorResponse('Unable to fetch user orders', error.message);
    res.status(500).json(response);
  }
});

express.server.put('/v1/orders/:orderId', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkIfOrderExists, middlewares.checkIfOrderStatusIsValid, async (req, res) => {
  try {
    await controller.updateOrder(req.params.orderId, req.body);
    let response = new successResponse('Order successfully updated');
    res.status(200).json(response);
  } catch (error) {
    let response = new errorResponse('Unable to update order', error.message);
    res.status(500).json(response);
  }
});

express.server.delete('/v1/orders/:orderId', middlewares.authorizeUser, middlewares.checkIfUserIsAdmin, middlewares.checkIfOrderExists, async (req, res) => {
  try {
    await controller.deleteOrder(req.params.orderId);
    let response = new successResponse('Order successfully deleted');
    res.status(200).json(response);
  } catch (error) {
    let response = new errorResponse('Unable to delete order', error.message);
    res.status(500).json(response);
  }
});