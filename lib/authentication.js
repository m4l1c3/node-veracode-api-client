'use strict';

const creds = require(process.env.VCCREDPATH);

class Authenticator {
    constructor() {
        if(creds !== undefined && creds !== '') {
            this.user = creds['user'];
            this.password = creds['password'];
        } 
        // else {
        //     throw "No credentials defined';
        // }
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
