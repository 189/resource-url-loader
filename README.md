# Resource url loader for webpack

Webpack 环境下的静态资源文件加载器。
得益于 [file-loader]()的构建思路，允许被引用文件base64进引用文件内，保留 webpack publicPath 生成逻辑，同时解决 url-loader 显式指定[path]和[context]无法正确解析引用文件和被引用文件相对位置关系问题。

## Usage  
#### 安装  

```
	$ npm install resource-url-loader --save	
```

#### API

- `pattern`，可选参数， 表示匹配规则，expect 为替换结果。下例中，路径规则中的 `images/` 会被替换为`../images/`  
- `invokerRoot` 必选参数，表示调用该资源文件的样式表所在目录。要求为绝对路径。
- `limit` 可选，单位kb，表示base64与否的阈值，大于该 limit 值的文件将被保留原始物理文件参与构建，小于该值的文件将被 base64编码压进引用文件源码中。


```
{
	test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
	loader: 'resource-url-loader',
	query: {
		limit : 1,
		invokerRoot : path.resolve(process.cwd(), "src/css"),
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