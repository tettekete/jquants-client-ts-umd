const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => (
{
	entry: {
		"j-quants": './src/j-quants.ts',
		extra: './src/extra.ts',
	},
	target: 'node',	// or 'web'
	mode: argv.mode || 'none',	// or 'development' or 'production'
	// 書き出し先設定
	output:
	{
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: '[name]',                  // 各バンドルに名前を付ける
		libraryTarget: 'umd',               // UMD フォーマットで出力
		globalObject: 'this',               // Node.js でもブラウザでも動作
	},

	// TypeScript のローダー設定
	module: {
    	rules:[
			{
				test: /\.ts$/,
				use: {
					loader: 'ts-loader',
				},
				exclude: /node_modules/
			}
		]
	},

	// 拡張子なしの import 文の拡張子解決順指定
	resolve:
	{
		extensions: [ '.ts' ,'.js' ]
	},

	// ソースマップは開発中のみ有効化
  	devtool: argv.mode === 'development' ? 'source-map' : false,

	// target: node の場合、これらはバンドルしない（node で提供されているため）
	externals: [
		{
			fs: 'commonjs fs',
			path: 'commonjs path',
		},
		// node_modules のモジュールをバンドルしない
		nodeExternals()
	],

	// __dirname,__filename について Webpack で上書きしない
	node: {
		__dirname: false,
		__filename: false,
	},
});
