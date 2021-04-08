const express = require('express');

const expressServerPort = 3000;
const server = express();

function checkConnection() {
    try {
        server.listen(expressServerPort, () => {});
        return true;
    } catch (error) {
        //console.log(error);
        return false;
    }
}

exports.checkConnection = checkConnection;
exports.server = server;