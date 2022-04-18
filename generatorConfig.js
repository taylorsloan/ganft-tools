const config = {
  "dir": "./converted/unitysample", // Specify the game directory
  "company": "ARTaylor", // Specify a company name
  "product": "My First GA-NFT", // Specify a product name
  "directUrl": "https://galaget.sfo3.cdn.digitaloceanspaces.com/myfirstganft", // Specify a URL where the game's Build directory is available
  "buildCid": "QmV1YnujES2khBBTgsreQoczqivhVcZT8SCkHocgm5Lgi1", // Specify an IPFS CID which points to the game's Build Directory
  "gateway": "https://mtcrypto.mypinata.cloud", // Specify a specific IPFS gateway to use
  "id": "game-title", // Specify the HTML title tag's ID
  "gid": "game-link", // Specify the HTML link tag's ID
  "title": "My First GA-NFT", // Specify the game's title text
  "description": "This my first GA-NFT. I made this using the tutorials at https://www.youtube.com/c/ARTaylor.", // Specify description for the uploaded game
  "url": "https://www.youtube.com/c/ARTaylor", // Specify the HTML url link,
  "first": 0, // Specify the first game ID
  "last": 1000, // Specify the last game ID. The generator will create games starting at the first game ID to the last.
  "batch": 5, // Specify the number of concurrent jobs
  "includeBuildFolder": false // Specifies whether to include game build folder with generated files.
};

module.exports = {config};