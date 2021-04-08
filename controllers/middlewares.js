const database = require('./database');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const errorResponse = require('../models/errorResponse');
const jwt = require('jsonwebtoken');
const apiKey = 'thisIsMyFirstAPI';

async function checkDatabaseConnection(req, res, next) {
  try {
    await database.checkConnection();
    next();
  } catch (error) {
    let response = new errorResponse('Unable to connect to database', error);
    res.status(500).json(response);
  }
}

function checkSignUpPayloadStructure(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are missing: ';
  if (req.body.userFirstName == undefined) {
    somethingIsMissing = true;
    message = message + 'userFirstName, ';
  }
  if (req.body.userLastName == undefined) {
    somethingIsMissing = true;
    message = message + 'userLastName, ';
  }
  if (req.body.userEmail == undefined) {
    somethingIsMissing = true;
    message = message + 'userEmail, ';
  }
  if (req.body.userPhoneNumber == undefined) {
    somethingIsMissing = true;
    message = message + 'userPhoneNumber, ';
  }
  if (req.body.userAddress == undefined) {
    somethingIsMissing = true;
    message = message + 'userAddress, ';
  }
  if (req.body.username == undefined) {
    somethingIsMissing = true;
    message = message + 'username, ';
  }
  if (req.body.userPassword == undefined) {
    somethingIsMissing = true;
    message = message + 'userPassword, ';
  }
  if (req.body.userRole == undefined) {
    somethingIsMissing = true;
    message = message + 'userRole, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to create the user', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

function checkSignUpRequiredDataWasSent(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are empty: ';
  if (req.body.userFirstName == '') {
    somethingIsMissing = true;
    message = message + 'userFirstName, ';
  }
  if (req.body.userLastName == '') {
    somethingIsMissing = true;
    message = message + 'userLastName, ';
  }
  if (req.body.userEmail == '') {
    somethingIsMissing = true;
    message = message + 'userEmail, ';
  }
  if (req.body.userPhoneNumber == '') {
    somethingIsMissing = true;
    message = message + 'userPhoneNumber, ';
  }
  if (req.body.userAddress == '') {
    somethingIsMissing = true;
    message = message + 'userAddress, ';
  }
  if (req.body.username == '') {
    somethingIsMissing = true;
    message = message + 'username, ';
  }
  if (req.body.userPassword == '') {
    somethingIsMissing = true;
    message = message + 'userPassword, ';
  }
  if (req.body.userRole == '') {
    somethingIsMissing = true;
    message = message + 'userRole, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to create the user', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

function checkIfUserRoleIsValid(req, res, next) {
  if (req.body.userRole == 'User' || req.body.userRole == 'Administrator') {
    next();
  } else {
    let response = new errorResponse('Unable to create user', 'The indicated user role is not a valid role. Try \'User\' or \'Administrator\' as user roles');
    res.status(500).json(response);
  }
}

async function checkIfUserEmailAlreadyExists(req, res, next) {
  try {
    if (await User.checkIfUserEmailAlreadyExists(req.body.userEmail) == true) {
      let response = new errorResponse('Unable to create user', 'There is already an user registered with this email');
      res.status(500).json(response);
    } else {
      next();
    }
  } catch (error) {
    let response = new errorResponse('Unable to check if user email already exists', error);
    res.status(500).json(response);
  }
}

async function checkIfUsernameAlreadyExists(req, res, next) {
  try {
    if (await User.checkIfUsernameAlreadyExists(req.body.username) == true) {
      let response = new errorResponse('Unable to create user', 'There is already an user registered with this username');
      res.status(500).json(response);
    } else {
      next();
    }
  } catch (error) {
    let response = new errorResponse('Unable to check if username already exists', error);
    res.status(500).json(response);
  }
}

function checkLoginPayloadStructure(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are missing: ';
  if (req.body.usernameOrUserEmail == undefined) {
    somethingIsMissing = true;
    message = message + 'usernameOrUserEmail, ';
  }
  if (req.body.userPassword == undefined) {
    somethingIsMissing = true;
    message = message + 'userPassword, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to authenticate user', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

function checkLoginRequiredDataWasSent(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are empty: ';
  if (req.body.usernameOrUserEmail == '') {
    somethingIsMissing = true;
    message = message + 'usernameOrUserEmail, ';
  }
  if (req.body.userPassword == '') {
    somethingIsMissing = true;
    message = message + 'userPassword, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to authenticate user', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

async function authorizeUser(req, res, next) {
  if (req.headers.authorization == undefined) {
    let response = new errorResponse('User could not be authorized', 'No JWT was included in the request');
    res.status(401).json(response);
  } else {
    try {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, apiKey);
      next();
    } catch (error) {
      let response = new errorResponse('User could not be authorized', error.message);
      res.status(401).json(response);
    }
  }
}

async function checkIfUserExists(req, res, next) {
  let results = await User.fetchUser(req.params.username);
  if (results == undefined) {
    let response = new errorResponse('The information for the requested user could not be fetched', 'The requested user does not exist');
    res.status(404).json(response);
  } else {
    next();
  }
}

async function checkIfUserIsAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let decodeToken = jwt.decode(token);
    if (decodeToken.userRole == 'User') {
      let response = new errorResponse('User is not authorized', 'User role is not authorized to perform this action');
      res.status(401).json(response);
    } else {
      next();
    }
  } catch (error) {
    let response = new errorResponse('User role could not be determined', error.message);
    res.status(401).json(response);
  }
}

function checkCreateProductPayloadStructure(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are missing: ';
  if (req.body.productName == undefined) {
    somethingIsMissing = true;
    message = message + 'productName, ';
  }
  if (req.body.productDescription == undefined) {
    somethingIsMissing = true;
    message = message + 'productDescription, ';
  }
  if (req.body.productPrice == undefined) {
    somethingIsMissing = true;
    message = message + 'productPrice, ';
  }
  if (req.body.productPicturePath == undefined) {
    somethingIsMissing = true;
    message = message + 'productPicturePath, ';
  }
  if (req.body.productAvailable == undefined) {
    somethingIsMissing = true;
    message = message + 'productAvailable, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to create the product', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

function checkCreateProductRequiredDataWasSent(req, res, next) {
  let somethingIsMissing = false;
  let message = 'The following JSON properties in request payload are empty: ';
  if (req.body.productName == '') {
    somethingIsMissing = true;
    message = message + 'productName, ';
  }
  if (req.body.productDescription == '') {
    somethingIsMissing = true;
    message = message + 'productDescription, ';
  }
  if (req.body.productPrice == '') {
    somethingIsMissing = true;
    message = message + 'productPrice, ';
  }
  if (somethingIsMissing == true) {
    message = message.substr(0, message.lastIndexOf(','));
    let response = new errorResponse('Unable to create the product', message);
    res.status(500).json(response);
  } else {
    next();
  }
}

async function checkIfProductAlreadyExists(req, res, next) {
  let results = await Product.fetchProductByName(req.body.productName);
  if (results == undefined) {
    next();
  } else {
    let response = new errorResponse('Product could not be created', 'A product matching the indicated product name already exists');
    res.status(500).json(response);
  }
}

async function checkIfProductExists(req, res, next) {
  let results = await Product.fetchProductById(req.params.productId);
  if (results == undefined) {
    let response = new errorResponse('Product could not be fetched', 'The requested product does not exist');
    res.status(404).json(response);
  } else {
    next();
  }
}

async function checkIfUserInOrderExists(req, res, next) {
  let results = await User.getUsername(req.body.userId);
  if (results == undefined) {
    let response = new errorResponse('Invalid user in order', 'The user associated to the order does not exist');
    res.status(404).json(response);
  } else {
    next();
  }
}

async function checkIfProductsInOrderExist(req, res, next) {
  let allProductsInOrderExist = true;
  let nonexistentProducts = new Array;
  for (i = 0; i < req.body.productsInOrder.length; i++) {
    let results = await Product.fetchProductById(req.body.productsInOrder[i].productId);
    if (results == undefined) {
      allProductsInOrderExist = false;
      nonexistentProducts.push(req.body.productsInOrder[i].productId)
    }
  }
  if (allProductsInOrderExist == true) {
    next();
  } else {
    let errorDescription = 'The products with the following productIds in the order do not exist:';
    let productIds = '.';
    for (i = 0; i < nonexistentProducts.length; i++) {
      if (i == 0) {
        productIds = ' ' + nonexistentProducts[i];
      } else {
        productIds = productIds + ', ' + nonexistentProducts[i];
      }
    }
    errorDescription = errorDescription + productIds;
    let response = new errorResponse('Invalid product in order', errorDescription);
    res.status(404).json(response);
  }
}

async function checkIfOrderExists(req, res, next) {
  let results = await Order.fetchOrder(req.params.orderId);
  if (results == undefined) {
    let response = new errorResponse('Order could not be fetched', 'The requested order does not exist');
    res.status(404).json(response);
  } else {
    next();
  }
}

async function checkIfOrderStatusIsValid(req, res, next) {
  if (req.body.orderStatus == 'Nuevo' || req.body.orderStatus == 'Confirmado' || req.body.orderStatus == 'Preparando' || req.body.orderStatus == 'Enviando' || req.body.orderStatus == 'Entregado') {
    next();
  } else {
    let response = new errorResponse('Order could not be updated', 'The status in the request payload is not a valid order status');
    res.status(404).json(response);
  }
}


exports.checkDatabaseConnection = checkDatabaseConnection;
exports.checkSignUpPayloadStructure = checkSignUpPayloadStructure;
exports.checkSignUpRequiredDataWasSent = checkSignUpRequiredDataWasSent;
exports.checkIfUserRoleIsValid = checkIfUserRoleIsValid;
exports.checkIfUsernameAlreadyExists = checkIfUsernameAlreadyExists;
exports.checkIfUserEmailAlreadyExists = checkIfUserEmailAlreadyExists;
exports.checkLoginPayloadStructure = checkLoginPayloadStructure;
exports.checkLoginRequiredDataWasSent = checkLoginRequiredDataWasSent;
exports.authorizeUser = authorizeUser;
exports.checkIfUserExists = checkIfUserExists;
exports.checkIfUserIsAdmin = checkIfUserIsAdmin;
exports.checkCreateProductPayloadStructure = checkCreateProductPayloadStructure;
exports.checkCreateProductRequiredDataWasSent = checkCreateProductRequiredDataWasSent;
exports.checkIfProductAlreadyExists = checkIfProductAlreadyExists;
exports.checkIfProductExists = checkIfProductExists;
exports.checkIfUserInOrderExists = checkIfUserInOrderExists;
exports.checkIfProductsInOrderExist = checkIfProductsInOrderExist;
exports.checkIfOrderExists = checkIfOrderExists;
exports.checkIfOrderStatusIsValid = checkIfOrderStatusIsValid; 