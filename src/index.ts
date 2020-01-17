import { createWorkerAddon } from "@watchedcom/sdk";

import { directoryHandler, itemHandler } from "./handlers";

export const moviesFoundOnline = createWorkerAddon({
    id: "moviesfoundonline.com",
    version: "1.0.0",
    name: "Moviesfoundonline.com",
    homepage: "https://moviesfoundonline.com/",
    description: "Addon for moviesfoundonline.com",
    flags: {
        adult: false
    },
    actions: ["directory", "item"],
    itemTypes: ["movie"],
    defaultOptions: {
        imageShape: "landscape",
        displayName: true
    }
});

moviesFoundOnline.registerActionHandler("directory", directoryHandler, {
    cache: { enabled: true }
});
moviesFoundOnline.registerActionHandler("item", itemHandler, {
    cache: { enabled: true }
});

export default moviesFoundOnline;
