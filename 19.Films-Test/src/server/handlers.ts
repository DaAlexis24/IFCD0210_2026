import { env } from '.././config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:server`);
log('Loading server handlers...')

// const errorManager = (error: HttpError, response: ServerResponse) => {
//     if (!('statusCode' in error)) {
//         error = {
//             ...new Error('Internal Server Error'),
//             status: 500,
//             statusMessage: 'Internal Server Error',
//         };
//     }
//     const errorInfo = `Error ${error.status}: ${error.statusMessage}`;
//     response.statusCode = error.status;
//     response.statusMessage = error.statusMessage;
//     log(errorInfo, error.message);
//     response.end(errorInfo);
// };

import type { Server } from "node:http";

export const listenManager = (server: Server) => {
    const addr = server.address();
    if (addr === null) return;
    let bind;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `${addr.address}:${addr?.port}`;
    }
    if (env.NODE_ENV !== 'dev') {
        console.log(`Server listening on ${bind}`);
    } else {
        log(`Servidor escuchando en ${bind}`);
    }
};
