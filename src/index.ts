import { createWorkerAddon } from "@watchedcom/sdk";

import { directoryHandler, itemHandler } from "./handlers";

export const moviesFoundOnline = createWorkerAddon({
    id: "moviesfoundonline.com",
    version: "1.0.0",
    name: "Moviesfoundonline.com",
    homepage: "https://moviesfoundonline.com/",
    icon:
        "https://mfo.bladecdn.net/wp-content/uploads/2015/05/38-512-5543f00fv1_site_icon-32x32.png",
    description: "Addon for moviesfoundonline.com",
    flags: {
        adult: false
    },
    actions: ["directory", "item"],
    itemTypes: ["movie"],
    defaultDirectoryOptions: {
        displayName: true,
        imageShape: "landscape"
    }
    // resources: [
    //     {
    //         name: {
    //             en: "Movies",
    //             de: "Filme"
    //         },
    //         actions: ["directory", "item"],
    //         itemTypes: ["movie"],
    //         defaultOptions: {
    //             imageShape: "landscape",
    //             displayName: true
    //         }
    //     }
    // ]
});

moviesFoundOnline.registerActionHandler("directory", directoryHandler);
moviesFoundOnline.registerActionHandler("item", itemHandler);

export default moviesFoundOnline;
