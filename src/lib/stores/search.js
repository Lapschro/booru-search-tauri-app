import { derived, writable } from "svelte/store";
import { Konachan, Yandere } from "../providers/booru_provider";

export const searchSettings = writable({
    site: "yandere",
});

export const searchProvider = derived(searchSettings, ($searchSettings) => {
    switch ($searchSettings.site) {
        case "yandere":
            return new Yandere();
    }
});

export const providers = ["yandere"];

export default {
    searchSettings,
    searchProvider,
    providers,
};
