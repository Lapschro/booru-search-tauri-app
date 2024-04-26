import { derived, writable } from "svelte/store";
import { Gelbooru, Konachan, Yandere } from "../providers/booru_provider";

export const searchSettings = writable({
    site: "yandere",
});

export const searchProvider = derived(searchSettings, ($searchSettings) => {
    switch ($searchSettings.site) {
        case "yandere":
            return new Yandere();
        case "gelbooru":
            return new Gelbooru();
        case "konachan":
            return new Konachan();
    }
});

export const providers = ["yandere", "gelbooru", "konachan"];

export default {
    searchSettings,
    searchProvider,
    providers,
};
