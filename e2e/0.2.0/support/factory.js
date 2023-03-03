const {DTBunch, DTElement} = require("../../../dist/src");

const emptyBunch = (key, options = {}) => new DTBunch(key, [], options);

const emptyVirtualBunch = (key) => emptyBunch(key, { virtualBunch: true });

const pentacleBunch = (key, options = {}) => new DTBunch(key, [
        haileiElement(),
        meldrineElement(),
        maydenaElement(),
        ildressElement(),
        yssaliaElement()
    ],
    options
);

const ownedEmptyBunch = (key, owner, options = {}) => {
    const bunch = emptyBunch(key, options);
    bunch.setOwner(owner);
    return bunch;
}

const haileiElement = () => {
    const element = new DTElement('HAILEI');
    element.setManyMeta({
        name: 'Hailei Dorcan Kazan',
        queen: true,
        kd: [47, 1],
        rank: 1,
        tribes: ['Peuple de Salta', 'Fils de Salta', 'Peuple Kanti'],
    });
    return element;
};

const meldrineElement = () => {
    const element = new DTElement('MELDRINE');
    element.setManyMeta({
        name: 'Meldrine Goldmane',
        queen: false,
        kd: [53, 0],
        rank: 2,
        tribes: ['Lodaniens'],
    });
    return element;
};

const maydenaElement = () => {
    const element = new DTElement('MAYDENA');
    element.setManyMeta({
        name: "Maydena 'Intan Kazan",
        queen: true,
        kd: [29, 0],
        tribes: ['Exil rouge', 'Désolation'],
    });
    return element;
};

const ildressElement = () => {
    const element = new DTElement('ILDRESS');
    element.setManyMeta({
        name: 'Electel Ildress',
        queen: false,
        kd: [19, 1],
        rank: 3,
    });
    return element;
};

const yssaliaElement = () => {
    const element = new DTElement('YSSALIA');
    element.setManyMeta({
        name: 'Yssalia du Gillit',
        queen: true,
        kd: [23, 0],
    });
    return element;
};

module.exports = {
    emptyBunch,
    emptyVirtualBunch,
    pentacleBunch,
    haileiElement,
    meldrineElement,
    maydenaElement,
    ildressElement,
    yssaliaElement,
}
