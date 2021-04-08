const database = require('../controllers/database');

module.exports =

    class User {
        constructor(userId, userFirstName, userLastName, userEmail, userPhoneNumber, userAddress, username, userPassword, userRole) {
            this.userId = userId;
            this.userFirstName = userFirstName;
            this.userLastName = userLastName;
            this.userEmail = userEmail;
            this.userPhoneNumber = userPhoneNumber;
            this.userAddress = userAddress;
            this.username = username;
            this.userPassword = userPassword;
            this.userRole = userRole;
        }

        static async checkIfUserEmailAlreadyExists(userEmailToCheck) {
            const query = `SELECT * FROM user WHERE user_email = '${userEmailToCheck}'`;
            let results = await database.connection.query(query);
            results = results[0];
            if (results.length != 0) {
                return true;
            } else {
                return false;
            }
        }

        static async checkIfUsernameAlreadyExists(usernameToCheck) {
            const query = `SELECT * FROM user WHERE username = '${usernameToCheck}'`;
            let results = await database.connection.query(query);
            results = results[0];
            if (results.length != 0) {
                return true;
            } else {
                return false;
            }
        }

        static async createUser(newUserData) {
            const query = `INSERT INTO user (user_first_name, user_last_name, user_email, user_phone_number, user_address, username, user_password, user_role) VALUES ('${newUserData.userFirstName}', '${newUserData.userLastName}', '${newUserData.userEmail}', '${newUserData.userPhoneNumber}', '${newUserData.userAddress}', '${newUserData.username}', '${newUserData.userPassword}', '${newUserData.userRole}')`;
            await database.connection.query(query);
        }

        static async validateUserCredentials(userCredentials) {
            const query = `SELECT user_password FROM user WHERE username = '${userCredentials.usernameOrUserEmail}' OR user_email = '${userCredentials.usernameOrUserEmail}'`;
            let results = await database.connection.query(query);
            results = results[0];
            if (results.length != 0) {
                results = results[0];
                if (results.user_password == userCredentials.userPassword) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        static async checkIfUserIsAdmin(userCredentials) {
            const query = `SELECT user_role FROM user WHERE username = '${userCredentials.usernameOrUserEmail}' OR user_email = '${userCredentials.usernameOrUserEmail}'`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            if (results.user_role == 'Administrator') {
                return true;
            } else {
                return false;
            }
        }

        static async fetchUsers() {
            const query = `SELECT * FROM user`;
            let results = await database.connection.query(query);
            results = results[0];
            return results;
        }

        static async fetchUser(username) {
            const query = `SELECT * FROM user WHERE username = '${username}'`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results;
        }

        static async fetchUserFavoriteProductsIds(username) {
            let userId = await this.getUserId(username);
            const query = `SELECT product_id FROM user_product_relation WHERE user_id = ${userId}`;
            let results = await database.connection.query(query);
            results = results[0];
            let productIds = new Array;
            for (let i = 0; i < results.length; i++) {
                productIds.push(results[i].product_id);
            }
            return productIds;
        }

        static async getUserId(username) {
            const query = `SELECT user_id FROM user WHERE username = '${username}'`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            return results.user_id;
        }

        static async getUsername(userId) {
            const query = `SELECT username FROM user WHERE user_id = '${userId}'`;
            let results = await database.connection.query(query);
            results = results[0];
            results = results[0];
            if (results == undefined) {
                return undefined;
            } else {
                return results.username;
            }
        }
    }