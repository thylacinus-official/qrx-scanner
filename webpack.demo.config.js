const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'demo'),
    entry: './index.tsx',
    output: {
        filename: 'demo.js',
        path: path.resolve(__dirname, 'dist/demo'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devServer: { https: true, host: '0.0.0.0' },
    devtool: 'source-map',
    plugins: [new HTMLWebpackPlugin({ template: './index.html' })],
    module: {
        rules: [
            {
                test: /worker\.ts$/,
                loader: 'worker-loader',
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
