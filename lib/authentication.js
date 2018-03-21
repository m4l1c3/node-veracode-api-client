'use strict';


const creds = require(process.env.VCCREDPATH);

class Authenticator {
    constructor() {
        this.user = creds['user'];
        this.password = creds['password'];
    }

    getUser() {
        return this.user;
    }

    getPassword() {
        return this.password;
    }
}

module.exports = new Authenticator();
