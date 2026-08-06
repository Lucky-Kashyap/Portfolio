const fs = require("fs");
const sharp = require("sharp");

const svg = fs.readFileSync("public/favicon.svg");

async function run() {
  await sharp(svg).resize(32, 32).png().toFile("app/icon.png");
  await sharp(svg).resize(180, 180).png().toFile("app/apple-icon.png");
  await sharp(svg).resize(32, 32).png().toFile("public/favicon-32.png");
  await sharp(svg).resize(16, 16).png().toFile("public/favicon-16.png");
  await sharp(svg).resize(180, 180).png().toFile("public/apple-icon.png");
  await sharp(svg).resize(32, 32).png().toFile("public/icon.png");
  console.log("d-favicon ok");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
