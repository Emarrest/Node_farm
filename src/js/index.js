const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("../modules/replaceTemplate");

// const textIn = fs.readFileSync("src/txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("src/txt/output.txt", textOut);
// console.log(textOut);

// // non-blocking, asynchronous way
// fs.readFile("src/txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`src/txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//   });
// });

//* Server
const tempOverview = fs.readFileSync(
  `src/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`src/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `src/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`src/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>This page could not be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
