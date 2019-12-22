import { WorkerHandlers } from "@watchedcom/sdk";

export const directoryHandler: WorkerHandlers['directory'] = async (
    input, ctx
) => {
    return {
        items: [{
            type: 'movie',
            ids: {
                id: 'chasing-christmas-2005',
            },
            name: 'Chasing Christmas (2005)',
            images: {
                poster: {
                    original: 'https://mfo.bladecdn.net/wp-content/uploads/2019/12/chasing-christmas-360x240.jpg'
                }
            }
        }],
    }
}