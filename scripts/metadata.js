const {config} = require("../generatorConfig");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const {program} = require("commander");
const {isFolder} = require("../utils/utils");
const Queue = require("async-await-queue");

const VERSION = "0.1";

let programOptions = null;
let workingDir = null;
let myQueue;

/**
 * Initialize convert program with CMD arguments.
 */
function init() {
    program
        .version(VERSION)
        .requiredOption("-d, --dir <string>", "Specify the generated games' directory")
        .requiredOption("-c, --cid <string>", "Specify the games' IPFS CID")

    program.parse(process.argv);
    programOptions = program.opts();
    myQueue = new Queue(config.batch, 0);
    console.log(`Initialized GA-NFT Metadata Generator Version: ${VERSION}`);
}

async function initWorkingDir() {
    const folderName = `${path.parse(config.dir).name}-metadata`;
    workingDir = path.join(process.cwd(), "generated", folderName);
    if (await isFolder(workingDir)) {
        await fsPromises.rmdir(workingDir, {recursive: true});
    }
    await fsPromises.mkdir(workingDir);
    console.log(`Metadata Stored: ${workingDir}`);
}

async function generateAllMetadata() {
    let gameFolders = (await fsPromises.readdir(programOptions.dir, {withFileTypes: true}))
        .filter(folder => folder.isDirectory());
    const pArray = [];
    for (const folder of gameFolders) {
        const gameId = folder.name;
        pArray.push(myQueue.run(async () => {
            const gameName = generateName(gameId);
            await generateMetadataJson(gameId, gameName, config.description, `${programOptions.cid}/${gameId}`);
        }));
    }
    // console.log(pArray)
    await Promise.all(pArray);
}

function generateName(gameId) {
    return `${config.title} #${gameId}`
}

async function generateMetadataJson(gameId, gameName, description, cid) {
    let animationUrl;
    if (config.gateway) {
        animationUrl = `${config.gateway}/ipfs/${cid}`
    } else {
        animationUrl = `ipfs://${cid}`
    }
    const data = {
        name: gameName,
        description: description,
        animation_url: animationUrl,
        external_url: config.url,
        game_url: `ipfs://${cid}`
    }
    data["image"] = `${data["game_url"]}/TemplateData/bg.png`
    const jsonData = JSON.stringify(data);
    await fs.writeFile(path.join(workingDir, `${gameId}.json`), jsonData, {encoding: "utf-8"}, () => {
    });
    console.log(`Saved Metadata for ${gameName}`);
}

async function main() {
    init();
    await initWorkingDir();
    await generateAllMetadata();
    console.log(`Finished generating metadata. Output location at ${workingDir}`);
}

main();




