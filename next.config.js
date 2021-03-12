const withImages = require('next-images')
module.exports = withImages();
// module.exports = {
//     trailingSlash: true,
//   }
// module.exports =

//     withImages(
//         {
//             exportPathMap: async function (
//                 defaultPathMap,
//                 { dev, dir, outDir, distDir, buildId }
//             ) {
//                 return {
//                     "/": { page: "/" },
//                     "/login": { page: "/login" },
//                     // "/about": { page: "/about" }
//                 };
//             }, trailingSlash: true
//         })

