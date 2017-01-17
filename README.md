# Resource url loader for webpack

Webpack 环境下的静态资源文件加载器。
得益于 [file-loader]()的构建思路，允许被引用文件base64进引用文件内，保留 webpack publicPath 生成逻辑，同时解决 url-loader 显式指定[path]和[context]无法正确解析引用文件和被引用文件相对位置关系问题。

## Usage  
大部分用法跟 url-loader 相同，直接参考[file-loader]()即可。

```
	$ npm install resource-url-loader --save	
```

新增cutomPathRules 参数，用于定义引用路径规则。   
pattern 表示匹配规则，expect 为替换结果。下例中，路径规则中的 `images/` 会被替换为`../images/` 

```
{
	test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
	loader: 'resource-url-loader',
	query: {
		limit : 1,
		name: '[path][name].[ext]',
		customPathRules : [
			{ pattern : "images/", expect : "../images/" }
		]
	}
}
```




## License

MIT (http://www.opensource.org/licenses/mit-license.php)


[file-loader]:https://github.com/webpack/file-loader
[url-loader]:https://github.com/webpack/url-loader