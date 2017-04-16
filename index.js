"use strict";

var loaderUtils = require("loader-utils");
var minetype = require("mime");
var path = require('path');

module.exports = function(content){
	var query, limit, mine, publicPath, config, relativePath, basename, url;
	var resourcePath = this.resourcePath;

	// 缓存 loader 结果
	if(this.cacheable){
		this.cacheable();
	}

	query = loaderUtils.parseQuery(this.query);
	
	limit = query.limit 
			? parseInt(query.limit, 10) 
			: ((this.options && this.options.url && this.options.url.dataUrlLimit) || 0);

	mine = query.mimetype || query.minetype || minetype.lookup(resourcePath);

	// 小于指定大小的文件 base64
	if(limit <= 0 || content.length < limit){
		return "module.exports = " + JSON.stringify("data:" + (mine ? mine + ";" : "") + "base64," + content.toString("base64"));
	}
	// 不符合 limit条件的其他文件生成物理文件
	else {
		if(!this.emitFile){
			throw new Error("emitFile is required from webpack module system , is your webapck too old ?");
		}

		config = Object.assign({
				publicPath : false
			}, 
			query, 
			this.options
		);

		relativePath = path.relative(config.invokerRoot, this.resourcePath);

		if(!config.invokerRoot){
			throw new Error('invokerRoot is required in resource-url-loader');
		}

		basename = path.basename(config.invokerRoot);

		config.publicPath = typeof config.publicPath == 'undefined'
							? this.options.output.publicPath
							: config.publicPath;

		config.name = basename + "/" + relativePath;

		url = loaderUtils.interpolateName(this, config.name, {
			context: config.context || this.options.context,
			content: content,
			regExp: config.regExp
		});

		var sourceUrl, rules = config.customPathRules, isMatch = false;

		if(config.publicPath){
			publicPath = JSON.stringify(
				typeof config.publicPath === 'function'
				? config.publicPath(url)
				: config.publicPath + url
			);
		}
		else {
			// 自定义路径生成规则 用于修复一些样式表文件通过相对路径引用上级目录文件问题
			if(rules){
				if(Array.isArray(rules)){
					rules.forEach(function(rule){
						if(url.indexOf(rule.pattern) > -1){
							sourceUrl = url.replace(rule.pattern, rule.expect);
							isMatch = true;
						}
					})
					if(!isMatch){
						sourceUrl = url.replace(/([^\/]+\/)/, '');
					}
				}
			}
			else {
				sourceUrl = url.replace(/([^\/]+\/)/, '');
			}
			// publicPath = "__webpack_public_path__ + " + JSON.stringify(sourceUrl);
			publicPath = JSON.stringify(sourceUrl);
		}

		// 指定文件路径生成文件
		this.emitFile(url, content);

		// Handle directory separator
		publicPath = publicPath.replace(/(?:\\)+/g, path.posix.sep);

		return "module.exports = " + publicPath + ";";
	}

};

module.exports.raw = true;







