const fs = require("fs");
const fsPromises = fs.promises;
const fse = require("fs-extra");
const path = require("path");
const {program} = require("commander");
const {isFolder, getFilesInDir, checkIndexFile} = require("../utils/utils");

const VERSION = "0.1";

let programOptions = null;
let baseDir = null;
let workingDir = null;
const ganftTemplateDir = "./lib/ganft-template"

/**
 * Initialize convert program with CMD arguments.
 */
function init() {
    program
        .version(VERSION)
        .requiredOption("-d, --dir <string>", "Specify the game directory")
        .option("-i, --image <string>", "Specify a background image")

    program.parse(process.argv);
    programOptions = program.opts();
    console.log(`Initialized Unity GA-NFT Converter Version: ${VERSION}`);
    console.log(`Selected game directory: ${programOptions.dir}`);
}

/**
 * Initialize a base directory in the project directory called "converted". The converted game files will output
 * here.
 */
async function initBaseDir() {
    baseDir = path.join(process.cwd(), "converted");
    if (!await fse.exists(baseDir)) {
        await fsPromises.mkdir(baseDir);
    }
}

/**
 * Copies the input folder into to the "converted" directory. If a game folder of the same name exists within the
 * "converted" directory, it will be deleted and recreated.
 * @returns {Promise<void>}
 */
async function initWorkingDir() {
    const folderName = path.parse(programOptions.dir).name;
    workingDir = path.join(baseDir, folderName);
    if (await isFolder(workingDir)) {
        await fsPromises.rm(workingDir, {recursive: true});
    }
    await fse.copy(programOptions.dir, workingDir);
}

/**
 * Renames the Unity build assets to be consistent with the references in the new index.html.
 * @returns {Promise<void>}
 */
async function processBuildFolder() {
    const buildFolder = path.join(workingDir, "Build");
    const buildFiles = await getFilesInDir(buildFolder);
    const fileMatches = {
        ".data": "build.data",
        ".framework.js": "framework.js",
        ".loader.js": "loader.js",
        ".wasm": "build.wasm"
    };
    for(const file of buildFiles) {
        const filename = path.basename(file);
        for (const [key, value] of Object.entries(fileMatches)) {
            if (filename.endsWith(key)) {
                const newPath = path.join(buildFolder, value);
                await fsPromises.rename(file, newPath);
            }
        }
    }
}

/**
 * Removes unnecessary files from the converted game.
 * @returns {Promise<void>}
 */
async function removeUnusedFiles() {
    const files = await getFilesInDir(workingDir, [], false);
    for (const file of files) {
        if (!(await isFolder(file))) {
            await fsPromises.rm(file);
        }
    }
    await removeTemplateFiles();
}

/**
 * Removes unused template files from the converted game files.
 * @returns {Promise<void>}
 */
async function removeTemplateFiles() {
    const keepTemplateFiles = [
        "favicon.ico",
        "progress-bar-full-dark.png",
        "progress-bar-empty-dark.png",
        "unity-logo-dark.png"
    ];
    const templateDataDir = path.join(workingDir, "TemplateData");
    const files = await getFilesInDir(templateDataDir);
    for (const file of files) {
        const filename = path.basename(file);
        if (!keepTemplateFiles.find(element => element === filename)) {
            await fsPromises.rm(file);
        }
    }
}

/**
 * Adds the GA-NFT files intro the converted game folder.
 * @returns {Promise<void>}
 */
async function addNFTFiles() {
    await fsPromises.cp(path.join(ganftTemplateDir, "loader.js"), path.join(workingDir, "Build", "loader.js"), {
        force: true
    })

    const templateGameDir = path.join(ganftTemplateDir, "game");
    let templateFiles = await fsPromises.readdir(templateGameDir, {withFileTypes: true});
    for (const file of templateFiles) {
        let fullPath = path.join(templateGameDir, file.name);
        await fsPromises.cp(fullPath, path.join(workingDir, file.name), {
            recursive: true
        });
    }

    await fsPromises.rename(path.join(workingDir, "bg.png"), path.join(workingDir, "TemplateData", "bg.png"));
    await fsPromises.rename(path.join(workingDir, "output.css"), path.join(workingDir, "TemplateData", "output.css"));
}

/**
 * Adds the specified PNG image as a background image to the converted files. Use images that are 512x512 pixels.
 * @param imagePath A path to a PNG image.
 * @returns {Promise<void>}
 */
async function importImageBg(imagePath) {
    if (await fse.exists(imagePath)) {
        await fsPromises.cp(imagePath, path.join(workingDir, "TemplateData", "bg.png"), {
            force: true
        });
    } else {
        console.log(`Could not find image:${imagePath}`);
    }
}

async function main() {
    init();
    await checkIndexFile(programOptions.dir);
    await initBaseDir();
    await initWorkingDir();
    await processBuildFolder();
    await removeUnusedFiles();
    await addNFTFiles();
    if (programOptions.image) {
        await importImageBg(programOptions.image);
    }
    console.log(`Finished conversion. Output location at ${workingDir}`);
}

main();




