import { invoke } from "@tauri-apps/api/tauri";
import type Post from "../types/posts";

export interface BooruProvider {
    fetchPage(tags: string, page: number, size: number): Promise<Post[]>;
}

export class Yandere implements BooruProvider {
    async fetchPage(tags: string, page: number, size: number): Promise<Post[]> {
        const res = await fetch(
            `https://yande.re/post.json?tags=${tags}+rating:s&page=${page++}&limit=${size}`,
            {
                method: "GET",
            }
        );

        const json = (await res.json()) as Post[];

        return json;
    }
}

export class Gelbooru implements BooruProvider {
    async fetchPage(tags: string, page: number, size: number): Promise<Post[]> {
        const res = (await invoke("fetch", {
            url: `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&pid=${page}&limit=${size}`,
        })) as string;

        const json = JSON.parse(res).post as Post[];
        return json;
    }
}

export class Konachan implements BooruProvider {
    async fetchPage(tags: string, page: number, size: number): Promise<Post[]> {
        const res = (await invoke("fetch", {
            url: `https://konachan.com/post.json?tags=${tags}&page=${page}&limit=${size}`,
        })) as string;

        const json = JSON.parse(res) as Post[];
        return json.map(x => {
            return {
                ...x,
                sample_url: x['preview_url'],
            }
        });
    }
}
