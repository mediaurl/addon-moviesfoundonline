import { createWorkerAddon } from '@watchedcom/sdk';
import { directoryHandler } from './handlers';

export const moviesFoundOnline = createWorkerAddon({
    id: 'moviesfoundonline.com',
    version: '1.0.0',
    name: 'Moviesfoundonline.com',
    homepage: 'https://moviesfoundonline.com/',
    description: 'Addon for moviesfoundonline.com',
    resources: [{
        actions: ['directory', 'item'],
        itemTypes: ['movie']
    }]
})

moviesFoundOnline.registerActionHandler('directory', directoryHandler)