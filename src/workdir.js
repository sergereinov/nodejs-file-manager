import { homedir } from 'node:os'

var workdir = homedir(); //initially set to homedir

export function getWorkdir() {
    return workdir;
}

export function setWorkdir(dir) {
    workdir = dir;
}
