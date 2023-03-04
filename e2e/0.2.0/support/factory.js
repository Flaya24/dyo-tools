const {DTBunch, DTElement} = require("../../../dist/src");

const emptyBunch = (key, options = {}) => new DTBunch(key, [], options);

const emptyVirtualBunch = (key) => emptyBunch(key, { virtualBunch: true });

const standard32Bunch = (key, options = {}) => new DTBunch(key, Object.values(standard32Elements()), options);

const ownedEmptyBunch = (key, owner, options = {}) => {
    const bunch = emptyBunch(key, options);
    bunch.setOwner(owner);
    return bunch;
}

const standard32Elements = () => {
    return {
        "7 of clubs": new DTElement('7 of clubs'),
        "8 of clubs": new DTElement('8 of clubs'),
        "9 of clubs": new DTElement('9 of clubs'),
        "10 of clubs": new DTElement('10 of clubs'),
        "J of clubs": new DTElement('J of clubs'),
        "Q of clubs": new DTElement('Q of clubs'),
        "K of clubs": new DTElement('K of clubs'),
        "As of clubs": new DTElement('As of clubs'),
        "7 of diamonds": new DTElement('7 of diamonds'),
        "8 of diamonds": new DTElement('8 of diamonds'),
        "9 of diamonds": new DTElement('9 of diamonds'),
        "10 of diamonds": new DTElement('10 of diamonds'),
        "J of diamonds": new DTElement('J of diamonds'),
        "Q of diamonds": new DTElement('Q of diamonds'),
        "K of diamonds": new DTElement('K of diamonds'),
        "As of diamonds": new DTElement('As of diamonds'),
        "7 of spades": new DTElement('7 of spades'),
        "8 of spades": new DTElement('8 of spades'),
        "9 of spades": new DTElement('9 of spades'),
        "10 of spades": new DTElement('10 of spades'),
        "J of spades": new DTElement('J of spades'),
        "Q of spades": new DTElement('Q of spades'),
        "K of spades": new DTElement('K of spades'),
        "As of spades": new DTElement('As of spades'),
        "7 of hearts": new DTElement('7 of hearts'),
        "8 of hearts": new DTElement('8 of hearts'),
        "9 of hearts": new DTElement('9 of hearts'),
        "10 of hearts": new DTElement('10 of hearts'),
        "J of hearts": new DTElement('J of hearts'),
        "Q of hearts": new DTElement('Q of hearts'),
        "K of hearts": new DTElement('K of hearts'),
        "As of hearts": new DTElement('As of hearts'),
    }
}

module.exports = {
    emptyBunch,
    emptyVirtualBunch,
    standard32Bunch,
    standard32Elements,
    ownedEmptyBunch
}
