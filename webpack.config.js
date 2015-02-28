module.exports = {
    entry: 'src/whill.js',
    output: {
        path: 'dist',
        filename: "whill.js",
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude:  /node_modules/,
            loader: 'babel-loader'
        }]
    }
};
