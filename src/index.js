import * as readline from 'node:readline/promises';
import { parseArgs } from './args.js'
import ctrl_c from './ctrl-c.js'
import { Commands } from './commands.js';
import { getWorkdir as workdir } from './workdir.js';
import navigation from './navigation.js'

const args = parseArgs(process.argv.slice(2));
const rl = readline.createInterface(process.stdin);

function exit() {
    console.log();
    console.log(`Thank you for using File Manager, ${args.username}, goodbye!`);
    rl.close();
    process.exit();
}

function showWorkdir() {
    console.log(`You are currently in ${workdir()}`);
}
function showPrompt() {
    process.stdout.write('>');
}

const commands = new Commands({
    '.exit': exit,
    'up': navigation.up,
    'cd': navigation.cd,
    'ls': navigation.ls
});

rl.on('line', (line) => {
    if (line.length > 0) {
        commands.do(line)
            //.catch(console.error) // error with stack trace, uncomment it to check behaviour
            .catch((e) => console.log(e.message))
            .finally(() => {
                showWorkdir();
                showPrompt();
            });
    } else {
        showPrompt();
    }
});

ctrl_c.addHandler(exit); // setup CTRL-C exit callback

console.log(`Welcome to the File Manager, ${args.username}!`);

showWorkdir();
showPrompt();
