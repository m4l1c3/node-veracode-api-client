'use strict';

const format = require('string-format'),
    logger = require('./logger');

format.extend(String.prototype);

class Authenticator {
    constructor() {
    }

    getUser() {
        return this.user;
    }

    getPassword() {
        return this.password;
    }

    getAuthObject(user = '', password = '') {
        if(user !== '' && password !== '') {
            this.user = user;
            this.password = password;
        }
        return {
            user: this.getUser(),
            pass: this.getPassword()
        };
    }
}

module.exports = new Authenticator();
