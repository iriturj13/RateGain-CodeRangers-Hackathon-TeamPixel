export default class Blog {
  constructor(obj) {
    this.image = obj.image ?? null;
    this.title = obj.title ?? null;
    this.likes = obj.likes ?? null;
    this.date = obj.date ?? null;
  }
}
