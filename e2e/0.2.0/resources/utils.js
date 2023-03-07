
const transformDataTableToBunchFinderArgs = (table) => {
    const validArgs = ['key', 'id', 'owner', 'scope'];
    const finalArgs = {};

    for (let [arg, value] of Object.entries(table.rowsHash())) {
        if (validArgs.includes(arg)) {
            finalArgs[arg] = { $eq: value };
        } else {
            if (!finalArgs.meta) {
                finalArgs.meta = {};
            }
            finalArgs.meta[arg] = { $eq: value };
        }
    }

    return finalArgs;
}

module.exports = {
    transformDataTableToBunchFinderArgs
}
