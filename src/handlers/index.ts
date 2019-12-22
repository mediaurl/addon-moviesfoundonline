import { WorkerHandlers } from "@watchedcom/sdk";
import * as cheerio from "cheerio";

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    { fetchRemote }
) => {
    console.log("directoryHandler", { input });

    const result = await fetchRemote("https://moviesfoundonline.com/", {});

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const html = await result.text();

    const $ = cheerio.load(html);

    $("div.item-img").each(function(index, elem) {
        const aElem = $(elem)
            .find("a")
            .first();
        const title = aElem.attr("title");
        console.log({ title });
    });

    return {
        items: [
            {
                type: "movie",
                ids: {
                    id: "chasing-christmas-2005"
                },
                name: "Chasing Christmas (2005)",
                images: {
                    poster: {
                        original:
                            "https://mfo.bladecdn.net/wp-content/uploads/2019/12/chasing-christmas-360x240.jpg"
                    }
                }
            }
        ]
    };
};

// const input = {
//     resourceId: 'movie',
//     type: 'movie',
//     ids: { id: 'chasing-christmas-2005' },
//     name: 'Chasing Christmas (2005)',
//     language: 'en'
// }
export const itemHandler: WorkerHandlers["item"] = async (
    input,
    { fetchRemote }
) => {
    console.log("itemHandler", { input });

    const baseUrl = "https://moviesfoundonline.com/video/";
    const {
        ids: { id }
    } = input;

    const result = await fetchRemote(baseUrl + id, {});

    const html = await result.text();

    if (!result.ok) {
        throw new Error(`Request finished with status ${result.status}`);
    }

    const $ = cheerio.load(html);

    const name = $("h1")
        .first()
        .text();
    const description = $("div.post-entry p").text();
    const youtubeEmbedSrc = $("iframe")
        .first()
        .prop("src");
    const youtubeId = youtubeEmbedSrc.split("/").pop();

    console.log({ youtubeEmbedSrc });

    return {
        type: "movie",
        ids: {
            id
        },
        name,
        description,
        videos: [
            {
                type: "youtube",
                id: youtubeId,
                name,
                youtubeId
                // youtubeId: 'xRjvmVaFHkk'
            }
        ]
    };
};
