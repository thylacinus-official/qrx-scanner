const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => (isProd ? `[name].min.${ext}` : `[name].${ext}`);

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        'qrx-scanner': './index.ts',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        library: 'qrx-scanner',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /worker\.ts$/,
                loader: 'worker-loader',
                options: {
                    inline: 'no-fallback',
                },
            },
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
