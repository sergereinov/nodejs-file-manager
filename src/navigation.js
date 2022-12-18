import { errorOperationFailed } from './errors.js'
import path from 'node:path'
import * as fs from 'node:fs/promises'

/**
 * Go upper from current directory
 * (when you are in the root folder this operation shouldn't change working directory).
 * 
 * CLI example: `up`
 */
export const up = () => cd('..');

/**
 * Go to dedicated folder from current directory (path_to_directory can be relative or absolute).
 * 
 * CLI examples:
 *  - `cd ../`
 *  - `cd temp/`
 *  - `cd d:/temp`
 * 
 * @param {string} pathToDirectory 
 */
export function cd(pathToDirectory) {
    try {
        const dir = pathToDirectory.endsWith(':') ? path.join(pathToDirectory, './') : pathToDirectory;
        process.chdir(dir);
    } catch (_) {
        throw new Error(errorOperationFailed);
    }
}

/**
 * Print in console list of all files and folders in current directory.
 * 
 * CLI example: `ls`
 * 
 * @returns {Promise} Promise with deferred operation
 */
export function ls() {
    const promise = fs.readdir(process.cwd(), { withFileTypes: true })
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
