const database = require('../controllers/database');

module.exports =

    class productInOrder {
        constructor(product, quantity) {
            this.product = product;
            this.quantity = quantity;
        }

        static async registerProductsInOrder(newOrder) {
            console.log(newOrder)
            for (i = 0; i < newOrder.productsInOrder.length; i++) {
                const query = `INSERT INTO order_product_relation (order_id, product_id, quantity) 
                VALUES (${newOrder.orderId}, ${newOrder.productsInOrder[i].product.productId}, ${newOrder.productsInOrder[i].quantity})`;
                await database.connection.query(query);
            }
        }

        static async fetchProductsInOrder(orderId) {
            const query = `SELECT * FROM order_product_relation WHERE order_id = ${orderId}`;
            let results = await database.connection.query(query);
            results = results[0];
            return results;
        }

        static async deleteProductsInOrder(orderId) {
            const query = `DELETE FROM order_product_relation WHERE order_id = ${orderId}`;
            await database.connection.query(query);
        }
    }