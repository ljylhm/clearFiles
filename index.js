const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const rimraf = require("rimraf");

// 修改 by ljy 2018/12/11
// ------------------- 记录输出的函数 ------------------
/**
 * @description 打印带颜色的信息的函数
 */
let log = {
    // 输出警告消息
    warn: (...mes) => console.log(chalk.yellow(...mes)),
    // 输出成功信息
    success: (mes) => console.log(chalk.green(mes)),
    // 输出错误信息
    error: (mes) => console.log(chalk.red(mes))
}
// ------------------ End ----------------------

// ------------------ 工具类函数 ----------------------
/**
 * @description 合并路径
 * @param {String} 路径1
 * @param {String} 路径1
 * @return {String} 合并后的路径
 */
let mergePath = (v1, v2) => p = v1.charAt(v1.length - 1) === "/" ? v1 + v2 : v1 + "/" + v2;

/* 获得当前目录下的全部文件 */
let getDirs = (path) => {
    if (isDir(path)) return fs.readdirSync(path);
    return new Array();
}
/* 过滤数组中的某个字符串 */
let filterArrByStr = (list, arr) => {
    let isString = typeof arr == "string" ? true : false;
    return list.filter((item, index) => {
        let flag = isString ? (item.indexOf(arr) == -1) : !arr.includes(item);
        // log.warn("filter", isString, "||", list, "||", arr, "||", flag, "||", item);
        return flag;
    })
}
/** */
let transform = (dir) => dir.replace("\\", "/");
/* 路径名是否存在 */
let isExist = (path) => fs.existsSync(path);
/* 是否是目录 */
let isDir = (path) => isExist(path) && fs.statSync(path).isDirectory();
/* 是否是文件 */
let isFile = (path) => isExist(path) && fs.statSync(path).isFile();
/** 遍历找出所有的文件 除了node_modules */
let existNodeModules = (arr, str) => arr.includes(str);
let findModules = (dir, strPath, opts = {}, list = []) => {
    dir = transform(dir);
    // 是否是文件夹
    if (!isDir(dir)) return;
    // 获得文件夹下的目录信息
    let filelist = getDirs(dir);



    if (existNodeModules(filelist, strPath)) {
        log.warn()
        list.push(mergePath(dir, strPath))
        log.success("===============================================================")
        log.success(`在最原始目录下找到的第 ${list.length} 个${strPath},文件位置在${mergePath(dir, strPath)}`);
    };

    // 过滤文件
    if (opts.filter) filelist = filterArrByStr(filelist, opts.filter);

    // log.warn(filelist);
    for (let i of filelist) {
        findModules(mergePath(dir, i), strPath, opts, list)
    }

    // log.success(`需找阶段结束  一共找到${list.length}个对应文件`);
    // log.success(`寻找耗时${findStartT - findEndT}ms`)
    return list;
}
let checkExternals = (p, externalsList = []) => {
    for (let i of externalsList) {
        if (p.indexOf(i) != -1) return true;
    }
    return false;
}
let transfromStrToArr = (str) => {
    if (typeof str == "string") {
        let _new_ = new Array();
        _new_.push(str);
        return _new_;
    }
}
let clear = (path, externals) => {

    let clearStartT = Date.now(); // 寻找开始的时间
    log.success(`******************Clear start********************`);

    let _success_index_ = 0,
        _error_index_ = 0,
        _count_all_ = 0,
        _ignore_all_ = 0,
        _err_list_ = [];

    let showResult = () => {
        let clearEndT = Date.now(); // 寻找开始的时间
        log.success(`******************Clear End********************`);
        log.warn(`清理阶段结束  一共清理${_count_all_}个对应文件 成功清理${_success_index_} 清理失败${_error_index_} 忽略文件夹${_ignore_all_}`);
        if (_error_index_ > 0) {
            log.warn(`失败的文件列表`);
            for (let i of _err_list_) {
                log.success(i);
            }
        }
        log.warn(`清理耗时: ${clearEndT - clearStartT}ms`)
    }

    return new Promise(resolve => {

        let handleResult = () => {
            if (_count_all_ == path.length) {
                showResult()
                resolve()
            } else fn(path[_count_all_])
        }

        // 如果是字符串的话 处理单个文件
        let fn = (p = path[_count_all_]) => {
            ++_count_all_;
            p = transform(p);
            if (checkExternals(p, externals)) {
                ++_ignore_all_;
                log.warn(`${p} 已被忽略`);
                handleResult();
                return;
            }
            log.warn(`当前路径为 ${p} 正在被删除***`);
            rimraf(p, (err) => {
                if (err) {
                    ++_error_index_;
                    _err_list_.push(err);
                    log.warn(`路径为 ${p} 被删除失败`);
                    log.error(`错误被找到 ${err}`);
                } else {
                    ++_success_index_;
                    log.success(`路径为 ${p} 已被成功删除`)
                }
                // 数组中的数据读取完毕 执行回调
                handleResult()
            })
        }

        if (typeof path == "string" && isExist(path)) path = transfromStrToArr(path);
        if (Array.isArray(path)) {
            // 如果是数组的话
            fn();
            // for (let i of path) {

            // }
        }
    })

};
// ------------------ End ----------------------

/**
 * @description 主函数
 * @param {opts} 
 * @param {externals} 过滤的文件夹 此类文件夹
 * opts:{
 *   filter:"" // 过滤的字符串 此类文件夹不用继续遍历  
 * }
 */

let main = function (path, target, opts) {
    log.success(`******************Find Start********************`);
    let findStartT = Date.now(); // 寻找开始的时间
    let modules_list = findModules(path, target, {
        filter: opts.filter // 此类文件夹不再深度遍历
    });
    let findEndT = Date.now();
    log.success(`******************Find End********************`);
    log.warn(`寻找阶段结束  一共找到${modules_list.length}个对应文件`);
    log.warn(`寻找耗时: ${findEndT - findStartT}ms`)

    clear(modules_list, opts.externals)
}

let test = function () {

}

// findModules("D:\\我的项目2", "dist", {
//     filter: ["node_modules"],
//     // externals: ["test1 - 副本 (2)", "test1 - 副本 (3)"]
// });

let exportData = { main, findModules, clear }

module.exports = exportData;










