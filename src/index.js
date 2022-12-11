import * as readline from 'node:readline/promises';
import { parseArgs } from './args.js'
import ctrl_c from './ctrl-c.js'
import { Commands } from './commands.js';

const args = parseArgs(process.argv.slice(2));
const rl = readline.createInterface(process.stdin);
const workdir = 'path_to_work_dir';

function exit() {
    console.log();
    console.log(`Thank you for using File Manager, ${args.username}, goodbye!`);
    rl.close();
    process.exit();
}

function showWorkdir() {
    console.log(`You are currently in ${workdir}`);

}
function showPrompt() {
    process.stdout.write('>');
}

const commands = new Commands({
    '.exit': exit
});

rl.on('line', (line) => {
    if (line.length > 0) {
        if (!commands.do(workdir, line)) {
            console.log('Invalid input');
        }
        showWorkdir();
    }
    showPrompt();
});

ctrl_c.addHandler(exit); // setup CTRL-C exit callback

console.log(`Welcome to the File Manager, ${args.username}!`);

showWorkdir();
showPrompt();
