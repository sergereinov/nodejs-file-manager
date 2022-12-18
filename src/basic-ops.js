import * as util from './util.js';
import { errorInvalidInput, errorOperationFailed } from './errors.js'
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
export function cat(pathToFile) {
    // Check input
    const target = pathToFile.trim();
    if (!target) {
        throw new Error(errorInvalidInput);
    }

    // Copy to stdout
    let readHandleToFile;
    const promise = fs.open(target)
        .then(filehandle => {
            readHandleToFile = filehandle;
            return util.lazyCopy(
                readHandleToFile.createReadStream(),
                process.stdout
            )
        })
        .finally(() => {
            readHandleToFile?.close();
        })
        .catch(() => {
            throw new Error(errorOperationFailed);
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
export function add(newFilename) {
    // Check input
    const target = newFilename.trim();
    if (!target || (path.basename(target) !== target)) {
        throw new Error(errorInvalidInput);
    }

    // Create new file
    const promise = fs.open(target, 'wx')
        .then(filehandle => filehandle.close())
        .catch(() => {
            throw new Error(errorOperationFailed);
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
export function rn(params) {
    const [pathToFile, newFilename] = util.splitParams(params);

    // Check input
    if (!pathToFile || !newFilename || (path.basename(newFilename) !== newFilename)) {
        throw new Error(errorInvalidInput);
    }

    // Prepare path
    const pathToNewFile = path.join(path.dirname(pathToFile), newFilename);

    // Rename file
    const promise = fs.rename(pathToFile, pathToNewFile)
        .catch(() => {
            throw new Error(errorOperationFailed);
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
export function cp(params) {
    const [pathToFile, pathToNewDirectory] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToNewDirectory) {
        throw new Error(errorInvalidInput);
    }

    // Prepare path
    const pathToNewFile = path.join(pathToNewDirectory, path.basename(pathToFile));

    // Copy file
    let readHandleToOldFile, writeHandleToNewFile;
    const promise = fs.open(pathToFile, 'r')
        .then(handle => {
            readHandleToOldFile = handle;
            return fs.open(pathToNewFile, 'wx');
        })
        .then(handle => {
            writeHandleToNewFile = handle;
            return util.lazyCopy(
                readHandleToOldFile.createReadStream(),
                writeHandleToNewFile.createWriteStream()
            );
        })
        .finally(() => {
            readHandleToOldFile?.close();
            writeHandleToNewFile?.close();
        })
        .catch(() => {
            throw new Error(errorOperationFailed);
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
export function mv(params) {
    const [pathToFile, pathToNewDirectory] = util.splitParams(params);

    // Check input
    if (!pathToFile || !pathToNewDirectory) {
        throw new Error(errorInvalidInput);
    }

    // Prepare path
    const pathToNewFile = path.join(pathToNewDirectory, path.basename(pathToFile));

    // Move file
    let readHandleToOldFile, writeHandleToNewFile;
    const promise = fs.open(pathToFile, 'r')
        .then(handle => {
            readHandleToOldFile = handle;
            return fs.open(pathToNewFile, 'wx');
        })
        .then(handle => {
            writeHandleToNewFile = handle;

            // Copy content
            return util.lazyCopy(
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
            return fs.rm(pathToFile);
        })
        .catch(() => {
            readHandleToOldFile?.close();
            writeHandleToNewFile?.close();

            throw new Error(errorOperationFailed);
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
export function rm(pathToFile) {
    // Check input
    const target = pathToFile.trim();
    if (!target) {
        throw new Error(errorInvalidInput);
    }

    // Delete file
    const promise = fs.rm(target)
        .catch(() => {
            throw new Error(errorOperationFailed);
        });

    return promise;
}
