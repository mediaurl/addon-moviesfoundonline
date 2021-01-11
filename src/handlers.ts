import { MovieItem, WorkerHandlers } from "@mediaurl/sdk";
import * as cheerio from "cheerio";

let genresPromise;

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    { fetch, requestCache }
) => {
    console.log("directoryHandler", { input });

    const directoryId = input.id;

    await requestCache(directoryId, {
        ttl: Infinity,
        refreshInterval: 24 * 3600 * 1000,
    });

    if (!directoryId) {
        genresPromise =
            genresPromise ||
            fetch("https://moviesfoundonline.com/free-movies/").then(
                async (resp) => {
                    const $ = cheerio.load(await resp.text());
                    const result: string[] = [];
                    $("a.tag-cloud-link").each((index, elem) => {
                        result.push($(elem).text());
                    });
                    return result;
                }
            );

        return {
            nextCursor: null,
            items: [
                {
                    type: "directory",
                    id: "free-movies",
                    name: "Full Movies",
                    features: {
                        filter: [
                            {
                                id: "genre",
                                name: "Film Genre",
                                values: await genresPromise,
                            },
                        ],
                    },
                },
                {
                    type: "directory",
                    id: "short-films",
                    name: "Short Films",
                },
                {
                    type: "directory",
                    id: "free-documentaries",
                    name: "Documentaries",
                },
                {
                    type: "directory",
                    id: "animation",
                    name: "Animation",
                },
                {
                    type: "directory",
                    id: "series-shows",
                    name: "Series & Shows",
                },
                {
                    type: "directory",
                    id: "stand-up-comedy",
                    name: "Stand-Up & Comedy",
                },
                {
                    type: "directory",
                    id: "viral-videos",
                    name: "Viral Videos",
                },
            ],
        };
    }

    const items: MovieItem[] = [];

    const { genre } = input.filter;

    const url =
        <string>input.cursor ??
        "https://moviesfoundonline.com/" +
            (genre ? `genre/${genre}` : directoryId);

    const result = await fetch(url, {});

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const html = await result.text();

    const $ = cheerio.load(html);

    $("div.video-section > div > div.item-img").each(function (index, elem) {
        const firstLink = $(elem).find("a").first();

        const genresPageTitle = $(elem).next("h3").text();
        const defaultPageTitle = firstLink.attr("title");

        const name = defaultPageTitle || genresPageTitle;
        const href = firstLink.attr("href");
        if (!href) return;
        const id = <string>href
            .split("/")
            .filter((_) => _)
            .pop();

        const posterImgElem = $(firstLink).find("img").first();

        items.push({
            type: "movie",
            ids: { id },
            name,
            images: {
                poster: posterImgElem.attr("src"),
            },
        });
    });

    return {
        nextCursor: $("a.next").attr("href") || null,
        items,
    };
};

export const itemHandler: WorkerHandlers["item"] = async (
    input,
    { requestCache, fetch }
) => {
    console.log("itemHandler", { input });

    const baseUrl = "https://moviesfoundonline.com/video/";
    const { id } = input.ids;

    await requestCache(id, {
        ttl: Infinity,
        refreshInterval: 24 * 3600 * 1000,
    });

    const result = await fetch(baseUrl + id, {});
    const html = await result.text();

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const $ = cheerio.load(html);

    const name = $("h1").first().text();
    const description = $("div.post-entry p").text();

    const frameSrc = $("iframe").first().prop("src");

    return {
        type: "movie",
        ids: { id },
        name,
        description,
        sources: [{ type: "url", name, url: frameSrc }],
        videos: [],
    };
};
