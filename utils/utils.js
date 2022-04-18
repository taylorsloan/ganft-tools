const path = require("path");
const fse = require("fs-extra");
const fsPromises = require("fs").promises;

function isErrorNotFound(err) {
    return err.code === "ENOENT";
}

/**
 * Checks that the given game input directory contains an index.html. Exits program if it doesn't.
 */
async function checkIndexFile(dir) {
    if (await fse.exists(path.join(dir, "index.html"))) {
        console.log("Found index.html!");
    } else {
        console.log(`Cannot find index.html in directory ${dir}`);
        process.exit(1);
    }
}

async function isFolder(path) {
    // the result can be either false (from the caught error) or it can be an fs.stats object
    const result = await fsPromises.stat(path).catch(err => {
        if (isErrorNotFound(err)) {
            return false;
        }
        throw err;
    });
    return !result ? result : result.isDirectory();
}

async function getFilesInDir(directoryName, results = [], deep = true) {
    let files = await fsPromises.readdir(directoryName, {withFileTypes: true});
    for (let f of files) {
        let fullPath = path.join(directoryName, f.name);
        if (f.isDirectory() && deep) {
            await getFilesInDir(fullPath, results);
        } else {
            results.push(fullPath);
        }
    }
    return results;
}

module.exports = { isFolder, getFilesInDir, checkIndexFile };