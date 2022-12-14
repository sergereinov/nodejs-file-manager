/** @module basic_ops */

import { splitParams, pathToAbsolute, lazyCopy } from './util.js';
import { getWorkdir } from "./workdir.js";
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Read file and print it's content in console.
 * 
 * CLI examples:
 *  - `cat c:/test.txt`
 *  - `cat ../test.txt`
 *  - `cat test.txt`
 * 
 * @param {string} pathToFile 
 * @returns {Promise} Promise with deferred operation
 */
function cat(pathToFile) {
    // Check input
    pathToFile = pathToFile.trim();
    if (!pathToFile) {
        throw new Error('Invalid input');
    }

    const absolutePathToFile = pathToAbsolute(pathToFile);

    // Copy to stdout
    const promise = fs.open(absolutePathToFile)
        .then(filehandle => lazyCopy(
            filehandle.createReadStream(),
            process.stdout
        ))
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Create empty file in current working directory.
 * 
 * CLI example: `add test.txt`
 * 
 * @param {string} newFilename 
 * @returns {Promise} Promise with deferred operation
 */
function add(newFilename) {
    // Check input
    newFilename = newFilename.trim();
    if (!newFilename || (path.basename(newFilename) !== newFilename)) {
        throw new Error('Invalid input');
    }

    const absolutePathToFile = path.resolve(path.join(getWorkdir(), newFilename));

    // Create new file
    const promise = fs.open(absolutePathToFile, 'wx')
        .then(filehandle => filehandle.close())
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Rename file (without changing its location/directory).
 * 
 * CLI example: `rn c:/test.txt test2.txt`
 * 
 * @param {string} params command arguments string containing `path_to_file new_filename`
 * @returns {Promise} Promise with deferred operation
 */
function rn(params) {
    const [pathToFile, newFilename] = splitParams(params);

    // Check input
    if (!pathToFile || !newFilename || (path.basename(newFilename) !== newFilename)) {
        throw new Error('Invalid input');
    }

    // Prepare paths
    const absolutePathToOldFile = pathToAbsolute(pathToFile);
    const dir = path.dirname(absolutePathToOldFile);
    const absolutePathToNewFile = path.join(dir, newFilename);
    if (absolutePathToNewFile !== path.resolve(absolutePathToNewFile)) {
        // error: probably given a path instead of a filename
        throw new Error('Invalid input');
    }

    // Rename file
    const promise = fs.rename(absolutePathToOldFile, absolutePathToNewFile)
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Copy file to new destination (without changing its name).
 * 
 * CLI examples:
 *  - `cp c:/test.txt d:/`
 *  - `cp ../test.txt d:/`
 *  - `cp test.txt d:/`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_new_directory`
 * @returns {Promise} Promise with deferred operation
 */
function cp(params) {
    const [pathToFile, pathToNewDirectory] = splitParams(params);

    // Check input
    if (!pathToFile || !pathToNewDirectory) {
        throw new Error('Invalid input');
    }

    // Prepare paths
    const absolutePathToOldFile = pathToAbsolute(pathToFile);
    const filename = path.basename(absolutePathToOldFile);
    const absolutePathToNewFile = pathToAbsolute(path.join(pathToNewDirectory, filename));

    // Copy file
    let readHandleToOldFile, writeHandleToNewFile;
    const promise = fs.open(absolutePathToOldFile, 'r')
        .then(handle => {
            readHandleToOldFile = handle;
            return fs.open(absolutePathToNewFile, 'wx');
        })
        .then(handle => {
            writeHandleToNewFile = handle;
            return lazyCopy(
                readHandleToOldFile.createReadStream(),
                writeHandleToNewFile.createWriteStream()
            );
        })
        .finally(() => {
            if (readHandleToOldFile) readHandleToOldFile.close();
            if (writeHandleToNewFile) writeHandleToNewFile.close();
        })
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Move file to new directory (without changing file name).
 * 
 * CLI examples:
 *  - `mv c:/test.txt d:/`
 *  - `mv ../test.txt d:/`
 *  - `mv test.txt d:/`
 * 
 * @param {string} params command arguments string containing `path_to_file path_to_new_directory`
 * @returns {Promise} Promise with deferred operation
 */
function mv(params) {
    const [pathToFile, pathToNewDirectory] = splitParams(params);

    // Check input
    if (!pathToFile || !pathToNewDirectory) {
        throw new Error('Invalid input');
    }

    // Prepare paths
    const absolutePathToOldFile = pathToAbsolute(pathToFile);
    const filename = path.basename(absolutePathToOldFile);
    const absolutePathToNewFile = pathToAbsolute(path.join(pathToNewDirectory, filename));

    // Move file
    let readHandleToOldFile, writeHandleToNewFile;
    const promise = fs.open(absolutePathToOldFile, 'r')
        .then(handle => {
            readHandleToOldFile = handle;
            return fs.open(absolutePathToNewFile, 'wx');
        })
        .then(handle => {
            writeHandleToNewFile = handle;

            // Copy content
            return lazyCopy(
                readHandleToOldFile.createReadStream(),
                writeHandleToNewFile.createWriteStream()
            );
        })
        .then(() => {
            readHandleToOldFile.close();
            readHandleToOldFile = null;
            writeHandleToNewFile.close();
            writeHandleToNewFile = null;

            // Delete original file
            return fs.rm(absolutePathToOldFile);
        })
        .catch(() => {
            if (readHandleToOldFile) readHandleToOldFile.close();
            if (writeHandleToNewFile) writeHandleToNewFile.close();

            throw new Error('Operation failed');
        });

    return promise;
}

/**
 * Delete file
 * 
  * CLI examples:
 *  - `rm c:/test.txt`
 *  - `rm ../test.txt`
 *  - `rm test.txt`
 * 
 * @param {string} pathToFile 
 * @returns {Promise} Promise with deferred operation
 */
function rm(pathToFile) {
    // Check input
    pathToFile = pathToFile.trim();
    if (!pathToFile) {
        throw new Error('Invalid input');
    }

    const absolutePathToFile = pathToAbsolute(pathToFile);

    // Delete file
    const promise = fs.rm(absolutePathToFile)
        .catch(() => {
            throw new Error('Operation failed');
        });

    return promise;
}

export default {
    cat,
    add,
    rn,
    cp,
    mv,
    rm
}
