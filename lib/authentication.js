'use strict';

const creds = require(process.env.VCCREDPATH),
    format = require('string-format'),
    logger = require('./logger');

format.extend(String.prototype);

class Authenticator {
    constructor() {
        if(creds !== undefined && creds !== '') {
            this.user = creds['user'];
            this.password = creds['password'];
        } 
        else {
            logger.error('No credentials defined');
        }
    }

    getUser() {
        return this.user;
    }

    getPassword() {
        return this.password;
    }

    getAuthObject() {
        return {
            user: this.getUser(),
            pass: this.getPassword()
        };
    }
}

module.exports = new Authenticator();
