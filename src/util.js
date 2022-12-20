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
