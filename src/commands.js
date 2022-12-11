export class Commands {
    constructor(commands) {
        this.commands = commands;
    }

    do(line) {
        const cmdLen = line.indexOf(' ');
        const cmd = (cmdLen > 0) ? line.substring(0, cmdLen) : line;
        const action = this.commands[cmd];
        if (typeof (action) === 'function') {
            const params = line.substring(cmdLen + 1);
            return action(params);
        }
        return false;
    }
};
