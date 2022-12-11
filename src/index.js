import { parseArgs } from './args.js'

const args = parseArgs(process.argv.slice(2));

function exit() {
    console.log(`Thank you for using File Manager, ${args.username}, goodbye!`)
    process.exit();
}

console.log(`Welcome to the File Manager, ${args.username}!`);

//TODO the app

exit();
