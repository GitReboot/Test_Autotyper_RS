import fs from "fs";
import path from "path";
import { app } from "electron";

export default class Store {
    constructor(filename = "data.json") {
        this.store = null;
        this.filePath = path.join(app.getPath('userData'), filename);
        console.log(this.filePath);

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify({
                minDelay: 8,
                maxDelay: 15,
                lists: []
            }, null, 2));
        }
    }

    load() {
        if (!this.store) {
            this.store = JSON.parse(fs.readFileSync(this.filePath));
        }

        return this.store;
    }

    save(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        this.store = data;
    }

    update(callback) {
        const data = this.load();
        callback(data);
        this.save(data);
    }
}