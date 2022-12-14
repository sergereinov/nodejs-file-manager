/**
 * Simplest splitting of command input params by spaces
 * @param {string} params 
 * @returns {string[]}
 */
export const splitParams = (params) => params.split(' ')
    .map((s) => s.trim())
    .filter((s) => s);
