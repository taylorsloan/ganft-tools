# GA-NFT Tools

This package is a collection of tools to convert WebGL games to GA-NFTs (Game-As-Nonfungible-Token). Currently, the tools only support Unity builds but the process could be adapted to support any WebGL game.

# Getting started

Use Node V16 or higher!

First clone this repo onto your computer. Export your Unity build in WebGL format with compression format set to disabled. You can access this setting by selecting Player Settings->Publishing Settings->Compression Format.

## Convert Game

Move your exported game into the input directory of the repo. Change into the project directory in the command line. There's an example game located in the input directory called "unitysample".

Run the command:

    npm run convert -- --dir ./input/unitysample   

The output game will be placed in:

    ganft-tools/converted/unitysample

## Generate Game Collection

After a game has been converted, this command generates multiple numbered instances of the converted game. This command also replaces data inside the index.html file for each game instance. If you wanted to modify how each game gets outputted, look in the "generate.js" script. The generation can be configured using the fields located in "generatorConfig.js" **The games will have the build directory removed by default.** The build directory should be accessible at the "directUrl" specified in "generatorConfig.js". After the games are generated, upload them to IPFS and copy the CID.

    npm run generate

## Generate Metadata for Game Collection

NFT metadata for the generated games can be generated with the command:

    npm run metadata -- -d "./generated/unitysample" -c "QmTGNaMxcfZ3ApoKUbsgFesVJh5jWhz4KQmUWB41LEwKQ2"

The "-c" parameter is the IPFS CID for the uploaded game collection. This parameter is used to generate the NFT metadata fields such as this for the image:

    ipfs://QmTGNaMxcfZ3ApoKUbsgFesVJh5jWhz4KQmUWB41LEwKQ2/0/TemplateData/bg.png

The generated metadata will be in the "generated" directory inside the project folder. This metadata can then be uploaded to IPFS for ERC721 smart contract usage.
