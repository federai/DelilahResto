const database = require('../controllers/database');
const moment = require('moment');

module.exports =

    class Order {
        constructor(orderId, orderPaymentMethod, orderStatus, orderCreationDate, userId) {
            this.orderId = orderId;
            this.orderPaymentMethod = orderPaymentMethod;
            this.orderStatus = orderStatus;
            this.orderCreationDate = orderCreationDate;
            this.userId = userId;
            this.productsInOrder = new Array;
        };

        static async getMaxOrderId() {
            const query = `SELECT MAX(order_id) AS order_id FROM orderr`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results.order_id;
        }

        static async createOrder(newOrderData) {
            const query = `INSERT INTO orderr (order_id, order_payment_method, order_status, order_creation_date, user_id) 
            VALUES (${newOrderData.orderId}, '${newOrderData.orderPaymentMethod}', '${newOrderData.orderStatus}', '${moment().format('YYYY-MM-DD HH:mm:ss')}', ${newOrderData.userId})`;
            await database.connection.query(query);
        }

        static async fetchOrders() {
            const query = `SELECT * FROM orderr`;
            let results = await database.connection.query(query);
            results = results[0];
            return results;
        }

        static async fetchOrder(orderId) {
            const query = `SELECT * FROM orderr WHERE order_id = ${orderId}`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results;
        }

        static async fetchUserOrders(userId) {
            const query = `SELECT * FROM orderr WHERE user_id = ${userId}`;
            let results = await database.connection.query(query);
            results = results[0];
            return results;
        }

        static async updateOrder(orderToUpdate) {
            const query = `UPDATE orderr SET order_status = '${orderToUpdate.orderStatus}' WHERE order_id = ${orderToUpdate.orderId}`;
            await database.connection.query(query);
        }

        static async deleteOrder(orderId) {
            const query = `DELETE FROM orderr WHERE order_id = ${orderId}`;
            await database.connection.query(query);
        }

    }