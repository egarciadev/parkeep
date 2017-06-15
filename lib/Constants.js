var Constants = function() {
	this.foo = "bar";
};

Constants.prototype.db = function(){
    return{
        LIKE:"ilike"
    };
};



Constants.prototype.className = "Constants";



module.exports.create = function() {
    return new Constants();
};

module.exports._class = Constants;

