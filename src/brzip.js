import * as util from './util.js';
import { errorInvalidInput, errorOperationFailed } from './errors.js'
import streamPromises from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

/**
 * Compress file (using Brotli algorithm, should be done using Streams API).
 * 
 * CLI examples:
 *  - `compress test.txt test.txt.br`
 *  - `compress ./test.txt d:/test.txt.br`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_destination`
 * @returns {Promise} Promise with deferred operation
 */
export function compress(params) {
    const [pathToFile, pathToDestination] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToDestination) {
        throw new Error(errorInvalidInput);
    }

    // Prepare streams
    try {
        var readStream = fs.createReadStream(pathToFile);
        var writeStream = fs.createWriteStream(pathToDestination, { flags: 'wx' });
    } catch (_) {
        throw new Error(errorOperationFailed);
    }

    // Compress file
    const promise = streamPromises.pipeline(
        readStream,
        zlib.createBrotliCompress(),
        writeStream
    )
        .then(() => {
            console.log(`Done compress to '${pathToDestination}'`);
        })
        .catch(() => {
            throw new Error(errorOperationFailed);
        });

    return promise;
}

/**
 * Decompress file (using Brotli algorithm, should be done using Streams API).
 * 
 * CLI examples:
 *  - `decompress test.txt.br test.txt`
 *  - `decompress d:/test.txt.br ./test.txt`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_destination`
 * @returns {Promise} Promise with deferred operation
 */
export function decompress(params) {
    const [pathToFile, pathToDestination] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToDestination) {
        throw new Error(errorInvalidInput);
    }

    // Prepare streams
    try {
        var readStream = fs.createReadStream(pathToFile);
        var writeStream = fs.createWriteStream(pathToDestination, { flags: 'wx' });
    } catch (_) {
        throw new Error(errorOperationFailed);
    }

    // Decompress file
    const promise = streamPromises.pipeline(
        readStream,
        zlib.createBrotliDecompress(),
        writeStream
    )
        .then(() => {
            console.log(`Done decompress to '${pathToDestination}'`);
        })
        .catch(() => {
            throw new Error(errorOperationFailed);
        });

    return promise;
}
