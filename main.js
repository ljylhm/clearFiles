
// 引入三个模块
let { main, findModules, clear } = require("./index");

// findModules("D:\\我的项目2", "dist", {
//     filter: ["node_modules"],
//     // externals: ["test1 - 副本 (2)", "test1 - 副本 (3)"]
// })

// main("D:\\testClear", "dist", {
//     filter: ["node_modules"],
//     externals: ["test2", "test4"]
// })

// 主函数导出
let exportData = {
    main, findModules, clear
}

module.exports = exportData;



