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

export class Konachan implements BooruProvider {
    async fetchPage(tags: string, page: number, size: number): Promise<Post[]> {
        const res = await fetch(
            `https://konachan.com/post.json?tags=${tags}+rating:s&page=${page++}&limit=${size}`,
            {
                method: "GET",
            }
        );

        const json = (await res.json()) as Post[];

        return json;
    }
}
