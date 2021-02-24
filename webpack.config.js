const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template:path.join(__dirname,`example/index.html`),
    filename:'./index.html'
});

module.exports = {
    devtool:'source-map',
    mode:'development',
    entry:path.join(__dirname,`example/index.js`),
    output:{
        path:path.resolve(__dirname,'build')  
    },
    module:{    
        rules:[
            {
                test:/\.(js|jsx)$/,
                use : 'babel-loader',
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            }
        ]
    },
    plugins:[htmlWebpackPlugin],
    resolve:{
        extensions:['.js','.jsx']
    },
    devServer:{
        port:3003,
        host: '0.0.0.0',
        // host: 'localhost',
        // useLocalIp: true
    }

}