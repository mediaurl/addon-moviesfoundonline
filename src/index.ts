import { createWorkerAddon } from "@watchedcom/sdk";

import { directoryHandler } from "./handlers";

export const moviesFoundOnline = createWorkerAddon({
    id: "moviesfoundonline.com",
    version: "1.0.0",
    name: "Moviesfoundonline.com",
    homepage: "https://moviesfoundonline.com/",
    description: "Addon for moviesfoundonline.com",
    flags: {
        adult: false
    },
    resources: [
        {
            id: "movie",
            name: {
                en: "Movies",
                de: "Filme"
            },
            actions: ["directory", "item"],
            itemTypes: ["movie"],
            requestArgs: ["id"]
        }
    ],
    dashboards: [
        {
            id: "full_movies",
            name: {
                en: "Recent Full Movies"
            },
            args: {
                resourceId: "movie"
            }
        }
    ]
});

moviesFoundOnline.registerActionHandler("directory", directoryHandler);
