const database = require('../controllers/database');

module.exports =

    class Product {
        constructor(productId, productName, productDescription, productPrice, productPicturePath, productAvailable) {
            this.productId = productId;
            this.productName = productName;
            this.productDescription = productDescription;
            this.productPrice = productPrice;
            this.productPicturePath = productPicturePath;
            this.productAvailable = productAvailable;
        }

        static async createProduct(newProductData) {
            const query = `INSERT INTO product (product_name, product_description, product_price, product_picture_path, product_available) 
            VALUES ('${newProductData.productName}', '${newProductData.productDescription}', ${newProductData.productPrice}, '${newProductData.productPicturePath}', ${newProductData.productAvailable})`;
            await database.connection.query(query);
        }

        static async fetchProducts() {
            const query = `SELECT * FROM product`;
            let results = await database.connection.query(query);
            results = results[0];
            return results;
        }

        static async fetchProductById(productId) {
            const query = `SELECT * FROM product WHERE product_id = ${productId}`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results;
        }

        static async fetchProductByName(productName) {
            const query = `SELECT * FROM product WHERE product_name = '${productName}'`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results;
        }

        static async updateProduct(productToUpdate) {
            const query = `UPDATE product SET product_name = '${productToUpdate.productName}', product_description = '${productToUpdate.productDescription}', product_price = ${productToUpdate.productPrice}, 
            product_picture_path = '${productToUpdate.productPicturePath}', product_available = ${productToUpdate.productAvailable} WHERE product_id = ${productToUpdate.productId}`;
            await database.connection.query(query);
        }

        static async deleteProduct(productId) {
            const query = `DELETE FROM product WHERE product_id = ${productId}`;
            await database.connection.query(query);
        }
    }