function addHandler(handler) {
    process.on('SIGHUP', handler); // terminal lost
    process.on('SIGINT', handler); // ctrl-c
    process.on('SIGQUIT', handler); // quit signal
    process.on('SIGTERM', handler); // kill signal
}

export default {
    addHandler
}
