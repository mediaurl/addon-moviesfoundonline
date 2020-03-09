import { MainItem, WorkerHandlers } from "@watchedcom/sdk";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    { requestCache }
) => {
    console.log("directoryHandler", { input });

    const { id } = input;
    await requestCache(id, {
        ttl: Infinity,
        refreshInterval: 24 * 3600 * 1000
    });

    if (!id) {
        return {
            hasMore: false,
            items: [
                {
                    type: "directory",
                    id: "free-movies",
                    name: "Full Movies"
                },
                {
                    type: "directory",
                    id: "short-films",
                    name: "Short Films"
                },
                {
                    type: "directory",
                    id: "free-documentaries",
                    name: "Documentaries"
                },
                {
                    type: "directory",
                    id: "animation",
                    name: "Animation"
                },
                {
                    type: "directory",
                    id: "series-shows",
                    name: "Series & Shows"
                },
                {
                    type: "directory",
                    id: "stand-up-comedy",
                    name: "Stand-Up & Comedy"
                },
                {
                    type: "directory",
                    id: "viral-videos",
                    name: "Viral Videos"
                }
            ]
        };
    }

    const items: MainItem[] = [];
    const result = await fetch("https://moviesfoundonline.com/" + id, {});

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const html = await result.text();

    const $ = cheerio.load(html);

    $("div.item-img").each(function(index, elem) {
        const aElem = $(elem)
            .find("a")
            .first();
        const name = aElem.attr("title");
        const href = aElem.attr("href");
        if (!href) return;
        const id = <string>href
            .split("/")
            .filter(_ => _)
            .pop();

        const posterImgElem = $(aElem)
            .find("img")
            .first();

        items.push({
            type: "movie",
            ids: { id },
            name,
            images: {
                poster: posterImgElem.attr("src")
            }
        });
    });

    return {
        items
    };
};

export const itemHandler: WorkerHandlers["item"] = async (
    input,
    { requestCache }
) => {
    console.log("itemHandler", { input });

    const baseUrl = "https://moviesfoundonline.com/video/";
    const { id } = input.ids;
    await requestCache(id, {
        ttl: Infinity,
        refreshInterval: 24 * 3600 * 1000
    });

    const result = await fetch(baseUrl + id, {});
    const html = await result.text();

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const $ = cheerio.load(html);

    const name = $("h1")
        .first()
        .text();
    const description = $("div.post-entry p").text();

    const frameSrc = $("iframe")
        .first()
        .prop("src");

    return {
        type: "movie",
        ids: { id },
        name,
        description,
        sources: [{ type: "url", name, url: frameSrc }],
        videos: []
    };
};
