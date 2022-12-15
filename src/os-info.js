import os from 'node:os'

const subcommands = {
    '--EOL': showEOL,
    '--cpus': showCpus,
    '--homedir': showHomedir,
    '--username': showUsername,
    '--architecture': showArchitecture
};

/**
 * Show operating system info.
 * 
 * CLI examples:
 *  - `os --EOL`
 *  - `os --cpus`
 *  - `os --homedir`
 *  - `os --username`
 *  - `os --architecture`
 * 
 * @param {string} param containing one of the subcommands such as `--EOL`, `--cpus`, etc.
 * @returns 
 */
export function info(param) {
    const action = subcommands[param];
    if (typeof (action) !== 'function') {
        // error: unknown subcommand '${param}'
        throw new Error('Invalid input');
    }
    return action();
}

/**
 * Get EOL (default system End-Of-Line) and print it to console.
 * 
 * CLI example: `os --EOL`
 */
function showEOL() {
    console.log(JSON.stringify(os.EOL));
}

/**
 * Get host machine CPUs info
 * (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
 * and print it to console.
 * 
 * CLI example: `os --cpus`
 */
function showCpus() {
    const cpus = os.cpus();
    const details = cpus.map((e) => {
        const obj = {
            model: e.model,
            clock_GHz: e.speed * 0.001
        };
        return obj;
    });

    console.log('amount of CPUS:', cpus.length);
    console.table(details);
}

/**
 * Get home directory and print it to console.
 * 
 * CLI example: `os --homedir`
 */
function showHomedir() {
    console.log(os.homedir());
}

/**
 * Get current system user name
 * (Do not confuse with the username that is set when the application starts)
 * and print it to console.
 * 
 * CLI example: `os --username`
 */
function showUsername() {
    console.log(os.userInfo().username);
}

/**
 * Get CPU architecture for which Node.js binary has compiled and print it to console.
 * 
 * CLI example: `os --architecture`
 */
function showArchitecture() {
    console.log(os.arch());
}
