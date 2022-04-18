const {config} = require("../generatorConfig");
const Queue = require('async-await-queue');
const fs = require("fs");
const fsPromises = fs.promises;
const fse = require("fs-extra");
const path = require("path");
const {parse} = require("node-html-parser");
const {checkIndexFile} = require("../utils/utils");

const VERSION = "0.1";

let baseDir = null;
let workingDir = null;
let originalGameDir = null;
let root = null;
let indexFile = null;
let myQueue;

function init() {
    myQueue = new Queue(config.batch, 0);
    console.log(`Initialized Game ID Generator Version: ${VERSION}`);
    console.log(`Selected game directory: ${config.dir}`);
}

/**
 * Initialize a base directory in the project directory called "outgoing". The generated game files will output
 * here.
 */
async function initBaseDir() {
    baseDir = path.join(process.cwd(), "generated");
    if (!await fse.exists(baseDir)) {
        await fsPromises.mkdir(baseDir);
    }
}

async function initWorkingDir() {
    const folderName = path.parse(config.dir).name;
    workingDir = path.join(baseDir, folderName);
    if (await fse.exists(workingDir)) {
        await fsPromises.rm(workingDir, {recursive: true});
    }
    await fsPromises.mkdir(workingDir);
    originalGameDir = path.join(workingDir, "original");
    await fsPromises.mkdir(originalGameDir);
    await fse.copy(config.dir, originalGameDir);
    if (!config.includeBuildFolder) {
        await fsPromises.rm(path.join(originalGameDir, "Build"), {
            recursive: true
        });
    }
    indexFile = path.join(workingDir, "original", "index.html");
    let indexData = await fsPromises.readFile(indexFile, {encoding: "utf8"});
    indexData = replaceGameText(indexData);
    root = parse(indexData);
}

function replaceGameText(textData) {
    let s = textData.replace("#COMPANY_NAME#", config.company);
    s = s.replace("#PRODUCT_NAME#", config.product);
    s = s.replace("#BUILD_CID#", config.buildCid);
    s = s.replace("#GATEWAY_URL#", config.gateway);
    s = s.replace("#DIRECT_URL#", config.directUrl);
    return s;
}

async function getGameDir(id) {
    const newDir = path.join(workingDir, id.toString());
    await fsPromises.mkdir(newDir);
    await fse.copy(originalGameDir, newDir);
    return newDir;
}

async function setGameElementsToId(gameId, saveIndexPath) {
    const tabTitleElement = root.querySelector(`#tab-title`);
    const titleElement = root.querySelector(`#${config.id}`);
    const linkElement = root.querySelector(`#${config.gid}`);
    if (!titleElement || !linkElement) {
        console.log("Could not find title element or link element in index.html.");
        process.exit(1);
    }
    if (tabTitleElement) {
        tabTitleElement.set_content(`${config.title} #${gameId}`);
    }
    titleElement.set_content(`${config.title} #${gameId}`);
    const url = `${config.url}/${gameId}`;
    titleElement.setAttribute("href", url);
    linkElement.setAttribute("href", url);
    await fsPromises.writeFile(saveIndexPath, root.toString(), {encoding: "utf8"});
}

async function main() {
    init();
    await checkIndexFile(config.dir);
    await initBaseDir();
    await initWorkingDir();
    const pArray = [];
    let idArray = [...Array(config.last).keys()]
    console.log(`Start Time: ${new Date()}`);
    for (let gameId of idArray) {
        console.log(`Queuing Generation for ID:${gameId}`);
        pArray.push(myQueue.run(async () => {
            const gameDir = await getGameDir(gameId);
            await setGameElementsToId(gameId, path.join(gameDir, "index.html"));
        }));
    }
    await Promise.all(pArray);
    // Delete original game directory.
    await fsPromises.rm(originalGameDir, {
        recursive: true
    });
    console.log(`Finished generating. Output location at ${workingDir}`);
}

main();




