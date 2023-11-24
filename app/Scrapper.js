import cheerio from "cheerio";
import Blog from "./Blog.js";

export default class Scrapper {
  cbs = {};
  constructor() {
    this.totalPages = 1;
    this.page = 1;
  }
  setPages(page) {
    this.totalPages = page;
  }
  load(path) {
    try {
      new URL(path);
      this.path = path;
    } catch (err) {
      this.cbs?.["error"]?.(err);
    }
  }
  async start() {
    try {
      console.log("start");
      await this.scrape();
    } catch (err) {
      this.cbs?.["error"]?.(err);
    }
    // this.$ = cheerio.load(page);
  }
  on(event, cb) {
    this.cbs[event] = cb;
  }
  async fetcher() {
    try {
      if (this.page >= this.totalPages) return null;
      const res = await fetch(this.path + "/" + this.page + "/");
      const page = await res.text();
      this.$ = cheerio.load(page);
      this.page <= this.totalPages ? this.page++ : null;
      return this.$;
    } catch (err) {
      return null;
    }
  }
  async scrape() {
    try {
      this.cbs?.["start"]?.();
      while (this.page <= this.totalPages) {
        await this.scrapeBlog();
        if (this.page === this.totalPages) break;
      }
      this.cbs?.["done"]?.();
    } catch (err) {
      this.cbs?.["err"]?.(err);
    }
  }
  async scrapeBlog() {
    try {
      const page = await this.fetcher();
      if (page === null) return null;
      const blogs = page("article.blog-item");
      blogs.each((i, el) => {
        const title = page("h6 a", el);
        const image = page("div.img a", el);
        const date = page("div.bd-item span", el);
        const likes = page("a.zilla-likes span").first().text().trim();
        const likeNumber = parseInt(likes, 10);
        this.cbs?.["data"]?.(
          new Blog({
            title: title.text(),
            date: date.first().text(),
            image: image.attr("data-bg"),
            likes: likeNumber,
          })
        );
      });
    } catch (err) {
      this.cbs?.["error"]?.(err);
    }
  }
}
