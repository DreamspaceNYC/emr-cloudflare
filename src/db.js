class TinyDB {
  constructor() {
    this.data = {};
    this.counter = 0;
  }

  insert(data) {
    const id = ++this.counter;
    this.data[id] = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return id.toString();
  }

  get(id) {
    return this.data[parseInt(id)];
  }

  update(id, data) {
    if (!this.data[parseInt(id)]) return false;
    this.data[parseInt(id)] = {
      ...this.data[parseInt(id)],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  delete(id) {
    const record = this.data[parseInt(id)];
    delete this.data[parseInt(id)];
    return record;
  }
}

export const db = new TinyDB();
