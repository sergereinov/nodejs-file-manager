// input args shuold be in format ['--prop1=value1', '--prop2=value2']
// returns an object like {'prop1':'value1', 'prop2':'value2}
export function parseArgs(args) {
    return args.reduce((acc, cur) => {
        if (cur.startsWith('--') && cur.includes('=')) {
            let [key, val] = cur.split('=')
            acc[key.substring(2)] = val
        }
        return acc;
    }, {});
}
