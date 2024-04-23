import { derived, writable } from "svelte/store";
import { Gelbooru, Yandere } from "../providers/booru_provider";

export const searchSettings = writable({
    site: "yandere",
});

export const searchProvider = derived(searchSettings, ($searchSettings) => {
    switch ($searchSettings.site) {
        case "yandere":
            return new Yandere();
        case "gelbooru":
            return new Gelbooru();
    }
});

export const providers = ["yandere", "gelbooru"];

export default {
    searchSettings,
    searchProvider,
    providers,
};
