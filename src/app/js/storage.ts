import * as fs from "fs";

import { ComponentsRefs } from "./components-refs";
import { IArticle } from "./component/feed";

export namespace FeedStorage {

    const defaultStoredContent: StoredContent = {
        feeds: []
    };

    export let storedContent: StoredContent = {
        feeds: []
    };

    export function store() {
        const newStoredContent = {
            feeds: ComponentsRefs.feedList.getStoreValue()
        };

        fs.writeFileSync("store.json", JSON.stringify(newStoredContent, null, 4));
    }

    export function load() {
        if (!fs.existsSync("store.json")) fs.writeFileSync("store.json", JSON.stringify(defaultStoredContent), "utf-8");
        const content = fs.readFileSync("store.json", "utf-8");
        storedContent = JSON.parse(content);
        console.log(storedContent);
    }

}

export interface StoredContent {
    feeds: StoredFeed[];
}

export interface StoredFeed {
    uuid: string;
    title: string;
    link: string;
    articles: IArticle[];
}