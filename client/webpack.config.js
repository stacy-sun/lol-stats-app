const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('./dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: ['node_modules'],
                use: [{ loader: 'babel-loader' }],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }],
            }
        ]
    }
}
