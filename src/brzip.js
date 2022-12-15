import * as util from './util.js';
import streamPromises from 'node:stream/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

/**
 * Compress file (using Brotli algorithm, should be done using Streams API).
 * 
 * CLI example: `compress test.txt test.txt.br`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_destination`
 * @returns {Promise} Promise with deferred operation
 */
export function compress(params) {
    const [pathToFile, pathToDestination] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToDestination) {
        throw new Error('Invalid input');
    }

    // Prepare paths
    const absolutePathToFile = util.pathToAbsolute(pathToFile);
    const absolutePathToDestination = util.pathToAbsolute(pathToDestination);

    // Prepare streams
    try {
        var readStream = fs.createReadStream(absolutePathToFile);
        var writeStream = fs.createWriteStream(absolutePathToDestination, { flags: 'wx' });
    } catch (_) {
        throw new Error('Operation failed');
    }

    // Compress file
    const promise = streamPromises.pipeline(
        readStream,
        zlib.createBrotliCompress(),
        writeStream
    )
        .then(() => {
            console.log(`Done compress to '${absolutePathToDestination}'`);
        })
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Decompress file (using Brotli algorithm, should be done using Streams API).
 * 
 * CLI example: `decompress test.txt.br test.txt`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_destination`
 * @returns {Promise} Promise with deferred operation
 */
export function decompress(params) {
    const [pathToFile, pathToDestination] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToDestination) {
        throw new Error('Invalid input');
    }

    // Prepare paths
    const absolutePathToFile = util.pathToAbsolute(pathToFile);
    const absolutePathToDestination = util.pathToAbsolute(pathToDestination);

    // Prepare streams
    try {
        var readStream = fs.createReadStream(absolutePathToFile);
        var writeStream = fs.createWriteStream(absolutePathToDestination, { flags: 'wx' });
    } catch (_) {
        throw new Error('Operation failed');
    }

    // Decompress file
    const promise = streamPromises.pipeline(
        readStream,
        zlib.createBrotliDecompress(),
        writeStream
    )
        .then(() => {
            console.log(`Done decompress to '${absolutePathToDestination}'`);
        })
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}
