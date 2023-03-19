const expect = require('expect')
const { Given, When, Then } = require('@cucumber/cucumber')
const {DTManager, DTPlayer, DTBunch, DTElement} = require("../../../dist/src");
const initializeDominionManager = require("../resources/dominion");
const {transformDataTableToBunchFinderArgs, extractKeysElement } = require("../resources/utils");

/******************* INSTALLATION (GIVEN) STEPS *************************/

Given('my empty manager', function () {
    this.manager = new DTManager('emptyManager', [], [], { errors: true });
})

Given('my dominion manager', function () {
    const { manager, current, players } = initializeDominionManager();
    this.manager = manager;
    this.current = current;
    this.players = players;
})

Given('deal is done', function () {
    const libraryCards = this.manager.getLibrary().getAll();
    const hands = this.manager.getAll('hand');
    let handIndex = 0;

    for (let card of libraryCards) {
        hands[handIndex].add(card);
        handIndex = handIndex === 0 ? 1 : 0;
    }
})


/**************************** ACT STEPS ********************************/

When('I add {int} physical bunches and {int} virtual bunches', function (nbBunches, nbVirtualBunches) {
    let i = 1;
    while (i <= nbBunches) {
        this.manager.add(new DTBunch('hand'));
        i++;
    }
    let j = 1;
    while (i <= nbVirtualBunches) {
        this.manager.add(new DTBunch('virtualHand', [], { virtualContext: true }));
        j++;
    }
});

Then('I should have {int} bunches in my manager', function (nbBunches) {
    expect(this.manager.getAll().length).toBe(nbBunches);
});

When('I add an already existing bunch', function () {
    this.manager.add(this.current.hand);
})

Then('I should see an error {string}', function (errorCode) {
    expect(this.manager.getLastError().getCode()).toBe(errorCode);
});

Then('I should find my current hand', function (pred) {
    expect(this.manager.get(this.current.hand.getId()).getId()).toBe(this.current.hand.getId());
})

Then('I shouldn\'t find my current hand', function (pred) {
    expect(this.manager.get(this.current.hand.getId())).toBeUndefined();
})

Then('I should find {int} bunches with', function (nbBunches, table) {
    const findArgs = transformDataTableToBunchFinderArgs(table);
    expect(this.manager.find(findArgs).length).toBe(nbBunches);
})


When('I move my current hand to the scope {string}', function (scope) {
    this.manager.moveToScope(scope, this.current.hand.getId());
})
When('I remove my current hand', function () {
    this.manager.remove(this.current.hand.getId());
})

Then('I should have {int} elements in my library', function (nbElements) {
    expect(this.manager.getLibrary().getAll().length).toBe(nbElements);
})

When('I add a new trash pile with 2 already existing elements into the scope {string}', function (scope) {
    const coppers = this.manager.getLibrary().find({ key: { $eq: 'COPPER' }});
    const trashPile = new DTBunch('trash', [
        new DTElement('CURSE'),
        new DTElement('CURSE'),
        new DTElement('CURSE'),
        coppers[0],
        coppers[1]
    ]);
    this.manager.add(trashPile, scope);
})

Then('I shouldn\'t find my library id into bunches', function () {
    const libraryId = this.manager.getLibrary().getId();
    expect(this.manager.get(libraryId)).toBeUndefined();
})

When('I add a new external card in my current hand', function () {
    const curseCard = new DTElement('CURSE');
    this.current.hand.add(curseCard);
})

Then('I should have {int} scopes in my manager', function (nbScopes) {
    expect(this.manager.getScopes().length).toBe(nbScopes);
})

Then('I should have {int} bunches in my scope {string}', function (nbBunches, scope) {
    expect(this.manager.getAll(scope).length).toBe(nbBunches);
})

When('I add a new action {string}', function (actionKey) {
    this.manager.addAction(new DTSimpleAction(actionKey, (element) => {}, {}));
})

Then('I should have {int} actions in my manager', function (nbActions) {
    expect(Object.keys(this.manager.getActions()).length).toBe(nbActions);
})

When('I shuffle my current {string}', function(bunchKey) {
    this.current[bunchKey].do('shuffle');
})

When('I draw my 5 cards hand', function() {
    let i = 0;
    while (i <= 5) {
        this.current.deck.get(0).do('draw');
    }
})

When('I play my first card Copper', function() {
    const firstCardCopper = this.current.hand.find({ key: { $eq: 'COPPER' }})[0];
    firstCardCopper.do('play');
})

Then('I should have copper,estate,copper,estate,copper at the top of my current deck', function() {
    const expected = ['COPPER','ESTATE','COPPER','ESTATE','COPPER'];
    expect(extractKeysElement(this.current.deck.getAll()).slice(0,5)).toStrictEqual(expected);
})

Then('I should have copper,estate,copper,estate,copper in my current hand', function() {
    const expected = ['COPPER','ESTATE','COPPER','ESTATE','COPPER'];
    expect(extractKeysElement(this.current.hand.getAll())).toStrictEqual(expected);
})

Then('I should have 1 copper into my play zone', function() {
    expect(extractKeysElement(this.current.playZone.getAll())).toStrictEqual(['COPPER']);
})

Then('my player should have {int} coin for the turn', function(nbCoins) {
    expect(this.current.player.getMeta('coin')).toBe(nbCoins);
})





