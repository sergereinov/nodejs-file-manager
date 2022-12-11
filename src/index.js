import { parseArgs } from './args.js'
import ctrl_c from './ctrl-c.js'

const args = parseArgs(process.argv.slice(2));

function exit() {
    console.log(`Thank you for using File Manager, ${args.username}, goodbye!`)
    process.exit();
}

ctrl_c.addHandler(exit); // setup CTRL-C exit callback

console.log(`Welcome to the File Manager, ${args.username}!`);

//TODO the app

setTimeout(() => exit, 5000); // testing
//exit();
