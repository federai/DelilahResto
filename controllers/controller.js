const database = require('./database');
const express = require('./express');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const ProductInOrder = require('../models/productInOrder');
const jwt = require('jsonwebtoken');
const apiKey = 'thisIsMyFirstAPI';


async function startAPI() {
  let databaseConnected = true
  try {
    await database.checkConnection();
  } catch (error) {
    databaseConnected = false;
  }
  let expressServerinitiated = express.checkConnection();
  if (databaseConnected) {
    console.log('Connected to database...');
  } else {
    console.log('Unable to connect to database...');
  }
  if (expressServerinitiated) {
    console.log('Express server initiated...');
  } else {
    console.log('Unable to initiate express server...');
  }
}

async function createUser(newUserData) {
  try {
    User.createUser(newUserData);
  } catch (error) {
    throw error;
  }
}

async function athenticateUser(userCredentials) {
  let token;
  if (await User.validateUserCredentials(userCredentials) == true) {
    let userIsAdmin = await User.checkIfUserIsAdmin(userCredentials);
    if (userIsAdmin) {
      data = {
        username: userCredentials.username,
        userEmail: userCredentials.user_email,
        userRole: 'Administrator'
      }
      try {
        token = jwt.sign(data, apiKey, {
          expiresIn: 36000
        });
      } catch (error) {
        throw error;
      }
    } else {
      data = {
        username: userCredentials.username,
        userEmail: userCredentials.user_email,
        userRole: 'User'
      }
      try {
        token = jwt.sign(data, apiKey, {
          expiresIn: 36000
        });
      } catch (error) {
        throw error;
      }
    }
    return token;
  } else {
    throw new Error('User credentials are not valid');
  }
}

async function getUsers() {
  let users = new Array;
  let results = await User.fetchUsers();
  for (i = 0; i < results.length; i++) {
    let newUser = new User(results[i].user_id, results[i].user_first_name, results[i].user_last_name, results[i].user_email, results[i].user_phone_number, results[i].user_address, results[i].username, results[i].user_password, results[i].user_role);
    users.push(newUser);
  }
  return users;
}

async function getUser(username) {
  let results = await User.fetchUser(username);
  let newUser = new User(results.user_id, results.user_first_name, results.user_last_name, results.user_email, results.user_phone_number, results.user_address, results.username, results.user_password, results.user_role);
  return newUser;
}

async function createProduct(newProductData) {
  try {
    await Product.createProduct(newProductData);
  } catch (error) {
    throw error;
  }
}

async function getProducts() {
  let products = new Array;
  let results = await Product.fetchProducts();
  for (i = 0; i < results.length; i++) {
    let newProduct = new Product(results[i].product_id, results[i].product_name, results[i].product_description, results[i].product_price, results[i].product_picture_path, results[i].product_available);
    products.push(newProduct);
  }
  return products;
}

async function getProduct(productId) {
  let results = await Product.fetchProductById(productId);
  let newProduct = new Product(results.product_id, results.product_name, results.product_description, results.product_price, results.product_picture_path, results.product_available);
  return newProduct;
}

async function getUserFavoriteProducts(username) {
  let productIds = await User.fetchUserFavoriteProductsIds(username);
  let products = new Array;
  for (i = 0; i < productIds.length; i++) {
    let newProduct = await getProduct(productIds[i]);
    products.push(newProduct);
  }
  return products;
}

async function updateProduct(productId, productData) {
  let productToUpdate = new Product(productId, productData.productName, productData.productDescription, productData.productPrice, productData.productPicturePath, productData.productAvailable);
  await Product.updateProduct(productToUpdate);
}

async function deleteProduct(productId) {
  await Product.deleteProduct(productId);
}

async function createOrder(newOrderData) {
  let productsInOrder = new Array;
  for (i = 0; i < newOrderData.productsInOrder.length; i++) {
    let newProduct = await getProduct(newOrderData.productsInOrder[i].productId);
    let newProductInOrder = new ProductInOrder(newProduct, newOrderData.productsInOrder[i].quantity);
    productsInOrder.push(newProductInOrder);
  }
  let newOrderId = await Order.getMaxOrderId();
  if (newOrderId == null) {
    newOrderId = 1;
  } else {
    newOrderId = newOrderId + 1;
  }
  console.log(newOrderId);
  let newOrder = new Order(newOrderId, newOrderData.orderPaymentMethod, newOrderData.orderStatus, '', newOrderData.userId);
  newOrder.productsInOrder = productsInOrder;
  await Order.createOrder(newOrder);
  await ProductInOrder.registerProductsInOrder(newOrder);
  return newOrder;
}

async function getOrders() {
  let orders = new Array;
  let results = await Order.fetchOrders();
  for (i = 0; i < results.length; i++) {
    let results1 = await ProductInOrder.fetchProductsInOrder(results[i].order_id);
    let productsInOrder = new Array;
    for (j = 0; j < results1.length; j++) {
      let newProductInOrder = new ProductInOrder(await getProduct(results1[j].product_id), results1[j].quantity);
      productsInOrder.push(newProductInOrder);
    }
    let newOrder = new Order(results[i].order_id, results[i].order_payment_method, results[i].order_status, results[i].order_creation_date, results[i].user_id);
    newOrder.productsInOrder = productsInOrder;
    orders.push(newOrder);
  }
  return orders;
}

async function getOrder(orderId) {
  let results = await Order.fetchOrder(orderId);
  let results1 = await ProductInOrder.fetchProductsInOrder(results.order_id);
  let productsInOrder = new Array;
  for (i = 0; i < results1.length; i++) {
    let newProductInOrder = new ProductInOrder(await getProduct(results1[i].product_id), results1[i].quantity);
    productsInOrder.push(newProductInOrder);
  }
  let order = new Order(results.order_id, results.order_payment_method, results.order_status, results.order_creation_date, results.user_id);
  order.productsInOrder = productsInOrder;
  return order;
}

async function getUserOrders(username) {
  let user = await getUser(username);
  let orders = new Array;
  let results = await Order.fetchUserOrders(user.userId);
  for (i = 0; i < results.length; i++) {
    let results1 = await ProductInOrder.fetchProductsInOrder(results[i].order_id);
    let productsInOrder = new Array;
    for (j = 0; j < results1.length; j++) {
      let newProductInOrder = new ProductInOrder(await getProduct(results1[j].product_id), results1[j].quantity);
      productsInOrder.push(newProductInOrder);
    }
    let newOrder = new Order(results[i].order_id, results[i].order_payment_method, results[i].order_status, results[i].order_creation_date, results[i].user_id);
    newOrder.productsInOrder = productsInOrder;
    orders.push(newOrder);
  }
  return orders;
}

async function updateOrder(orderId, orderData) {
  let orderToUpdate = new Order(orderId, '', orderData.orderStatus, '', '');
  await Order.updateOrder(orderToUpdate);
}

async function deleteOrder(orderId) {
  console.log(orderId)
  await ProductInOrder.deleteProductsInOrder(orderId);
  await Order.deleteOrder(orderId);
}


exports.startAPI = startAPI;
exports.createUser = createUser;
exports.athenticateUser = athenticateUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getUserFavoriteProducts = getUserFavoriteProducts;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.getOrder = getOrder;
exports.getUserOrders = getUserOrders;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;