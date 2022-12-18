import { getWorkdir, setWorkdir } from "./workdir.js";
import { errorInvalidInput, errorOperationFailed } from './errors.js'
import path from 'node:path'
import * as fs from 'node:fs/promises'

/**
 * Go upper from current directory
 * (when you are in the root folder this operation shouldn't change working directory).
 * 
 * CLI example: `up`
 */
export function up() {
    const dir = path.resolve(getWorkdir(), '..');
    setWorkdir(dir);
}

/**
 * Go to dedicated folder from current directory (path_to_directory can be relative or absolute).
 * 
 * CLI examples:
 *  - `cd ../`
 *  - `cd temp/`
 *  - `cd d:/temp`
 * 
 * @param {string} pathToDirectory 
 * @returns {Promise} Promise with deferred operation
 */
export function cd(pathToDirectory) {
    // Check input args
    let target = pathToDirectory.trim();
    if (target.length === 0) {
        // error: target path not set
        throw new Error(errorInvalidInput)
    }

    target = target + '/'; // in case of change disk like 'cd d:'

    let dir;
    if (path.isAbsolute(target)) {
        dir = path.resolve(target);
    } else {
        dir = path.resolve(path.join(getWorkdir(), target));
    }

    // Check if the destination folder exists
    const promise = fs.stat(dir)
        .then((stats) => {
            if (!stats.isDirectory()) {
                throw new Error(errorOperationFailed);
            }
            setWorkdir(dir);
        })
        .catch(() => {
            // error: failed to change working dir to '${dir}'
            throw new Error(errorOperationFailed);
        });

    return promise;
}

/**
 * Print in console list of all files and folders in current directory.
 * 
 * CLI example: `ls`
 * 
 * @returns {Promise} Promise with deferred operation
 */
export function ls() {
    const promise = fs.readdir(getWorkdir(), { withFileTypes: true })
        .then((e) => {

            // Sort by names and directory first
            e.sort((a, b) => {
                if (a.isDirectory() === b.isDirectory()) {
                    return a.name.localeCompare(b);
                }
                if (a.isDirectory()) {
                    return -1;
                }
                return 1;
            });

            // Convert into table with {Name, Type} structure
            const entities = e.map((v) => ({
                Name: v.name,
                Type: v.isDirectory() ? 'directory' : 'file'
            }));

            // Print it
            console.table(entities);
        });

    return promise;
}
