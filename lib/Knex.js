var Knex = function(_host, _username, _password, _database) {
    this.host = _host;
    this.username = _username;
    this.password = _password;
    this.database = _database;
    this.pg;
    
    return this;
};

Knex.prototype.connect = function() {

    var that = this;

    that.connectionString = 'pg://' + this.username + ':' + this.password + '@' + this.host + '/' + this.database;
    
    console.log("trying to connect to postgre from knex ", this.username ,this.host);

    that.pg = require('knex')({
        client: 'pg',
        connection: {
		host: this.host,
		user: this.username,
		password: this.password,
		database: this.database
	},
        pool: {
            min: 1,
            max: 5,
            idleTimeoutMillis:  30000,
            reapIntervalMillis: 2000
        }
    });
    
    return this;
};

Knex.prototype.getInstance = function() {

    return this.pg;
};

module.exports.create = function(dbHost, dbUsername, dbPassword, dbName) {
    return new Knex(dbHost, dbUsername, dbPassword, dbName);
};

module.exports._class = Knex;

