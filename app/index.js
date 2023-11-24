import fs from "fs";
import Blog from "./Blog.js";
import Scrapper from "./Scrapper.js";

const scrapper = new Scrapper();
const filePath = "output.csv";

// This function calls if error occurs
scrapper.on("error", (err) => {
  console.log("error occured", err.message);
});
// This function call before the scrapping process
scrapper.on("start", () => {
  console.log("Scrapping Start");
  const header = Object.keys(new Blog({}));
  fs.writeFileSync(filePath, header.join(",") + "\n");
});
// This function calls then ewverything is done Successfully

scrapper.on("done", () => {
  console.log("Done");
  fs?.close();
});
// This function calls for each blog fetched
scrapper.on("data", (blog) => {
  console.count("blog");
  const csvRow = convertObjectToCSV(blog);
  fs.appendFileSync(filePath, csvRow + "\n");
});

scrapper.load(`https://rategain.com/blog/page`); // loading the initial URL
scrapper.setPages(45); // setting the number of pages you want to extract ;
scrapper.start(); // Starting the Scrapping

function convertObjectToCSV(obj) {
  const values = Object.values(obj);
  const escapedValues = values.map((value) => {
    if (typeof value === "string") {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  });
  return escapedValues.join(",");
}
