import { getWorkdir } from "./workdir.js";
import path from 'node:path'

/**
 * Simplest splitting of command input params by spaces
 * @param {string} params 
 * @returns {string[]}
 */
export const splitParams = (params) => params.split(' ')
    .map((s) => s.trim())
    .filter((s) => s);

/**
* Resolve relative or absolute path to absolute path.
* @param {string} target relative or absolute path
* @returns {string} absolute path to target
*/
export function pathToAbsolute(target) {
    let dir;
    if (path.isAbsolute(target)) {
        dir = path.resolve(target);
    } else {
        dir = path.resolve(path.join(getWorkdir(), target));
    }
    return dir;
}

/**
 * Lazy copying of chunks from read stream to write stream
 * @param {ReadableStream} readable 
 * @param {WritableStream} writable 
 * @returns {Promise}
 */
export async function lazyCopy(readable, writable) {
    for await (const chunk of readable) {
        writable.write(chunk);
    }
}
