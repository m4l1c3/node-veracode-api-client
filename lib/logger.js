'use strict';

const format = require('string-format'),
    chalk = require('chalk'),
    log = console.log;

format.extend(String.prototype);

class Logger {
    error(message) {
        log(chalk.red('{} Error: {}'.format(this.errorOrWarningPrefix(), message)));
    }

    warning(message) {
        log(chalk.magenta('{} Warning: {}'.format(this.errorOrWarningPrefix(), message)));
    }

    debug(message) {
        log(chalk.cyan('{} Debug: {}'.format(this.infoOrDebugPrefix(), message)));
    }

    info(message) {
        log(chalk.green('{} Info: {}'.format(this.infoOrDebugPrefix(), message)));
    }

    errorOrWarningPrefix() {
        return '[!] -';
    }

    infoOrDebugPrefix() {
        return '[+] -';
    }
}

module.exports = new Logger();
