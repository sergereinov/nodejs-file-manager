import { getWorkdir, setWorkdir } from "./workdir.js";
import path from 'node:path'
import * as fs from 'node:fs/promises'

function up() {
    const dir = path.resolve(getWorkdir(), '..');
    setWorkdir(dir);
}

async function cd(target) {
    let dir;
    if (path.isAbsolute(target)) {
        dir = path.resolve(target);
    } else {
        dir = path.resolve(path.join(getWorkdir(), target));
    }

    // Check if the destination folder exists
    const promise = fs.stat(dir)
        .then(() => {
            setWorkdir(dir);
        })
        .catch(() => {
            throw new Error(`failed to change working dir to '${dir}'`);
        });

    return promise;
}

async function ls() {
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
            const entities = e.map((v) => {
                const obj = {
                    Name: v.name,
                    Type: v.isDirectory() ? 'directory' : 'file'
                };
                return obj;
            });

            // Print it
            console.table(entities);
        });

    return promise;
}

export default {
    up,
    cd,
    ls
}
