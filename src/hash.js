import * as util from './util.js';
import { errorInvalidInput, errorOperationFailed } from './errors.js'
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

/**
 * Calculate hash for file and print it into console.
 * 
 * CLI examples:
 *  - `hash c:/test.txt`
 *  - `hash ../test.txt`
 *  - `hash test.txt`
 * 
 * @param {string} pathToFile 
 * @returns {Promise} Promise with deferred operation
 */
export function calcHash(pathToFile) {
    // Check input
    pathToFile = pathToFile.trim();
    if (!pathToFile) {
        throw new Error(errorInvalidInput);
    }

    const absolutePathToFile = util.pathToAbsolute(pathToFile);

    // Calc hash
    let readHandleToFile, hasher;
    const promise = fs.open(absolutePathToFile, 'r')
        .then(handle => {
            readHandleToFile = handle;
            hasher = createHash('sha256');
            return util.lazyCopy(
                readHandleToFile.createReadStream(),
                hasher
            );
        })
        .then(() => {
            const hex = hasher.digest('hex');
            console.log(hex);
        })
        .finally(() => {
            if (readHandleToFile) readHandleToFile.close();
        })
        .catch(() => {
            throw new Error(errorOperationFailed);
        });

    return promise;
}
