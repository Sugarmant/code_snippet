// module.exports = {
//     plugins: [
//         require('autoprefixer')({
//             overrideBrowserslist:[
//                 "defaults",
//                 "not ie < 11",
//                 "last 2 versions",
//                 "> 1%",
//                 "iOS 7",
//                 "last 3 iOS versions"
//             ]
//         }),
//         require('postcss-pxtorem')({
//             rootValue:16*2,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
//             propList: ['*'],
//             exclude: /node_modules/i
            
//         })
//     ]
// }