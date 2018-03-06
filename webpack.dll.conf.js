const path = require('path');
const webpack = require('webpack');

let vArr = ['react', 'react-dom', 'react-router', 'jquery', 'axios']

if (process.env.NODE_ENV === 'production') {

    module.exports = {
        entry: {
            vendor: vArr
        },
        mode: 'production',
        output: {
            path: path.join(__dirname, './public'),
            filename: '[name]/vendor.dll.js',
            library: '[name]'
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, './public', '[name]/vendor-manifest.json'),
                name: '[name]'
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        ]
    };

} else {
    module.exports = {
        entry: {
            vendor: vArr
        },
        mode: 'development',
        output: {
            path: path.join(__dirname, './public'),
            filename: '[name]/vendor.dll.dev.js',
            library: '[name]'
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, './public', '[name]/vendor-manifest-dev.json'),
                name: '[name]'
            })
        ]
    };
}