"use strict";


var loaderUtils = require("loader-utils");
var minetype = require("mime");

module.exports = function(content){
	var query, limit, minetype;
	var resourcePath = this.resourcePath;

	if(this.cacheable){
		this.cacheable();
	}

	query = loaderUtils.parseQuery(this.query);
	limit = (this.options && this.options.url && this.options.url.dataUrlLimit) || 0;
	
	if(query.limit){
		limit = parseInt(query.limit, 10);
	}

	minetype = query.mimetype || query.minetype || mime.lookup(resourcePath);

	// base64
	if(limit <= 0 || content.length < limit){
		// return "module.exports = " + JSON.stringify("data:");
		return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
	}
	// no base64
	else {
		// var fileLoader = require("file-loader");
		// return fileLoader.call(this, content);
	}

};

module.exports.raw = true;







