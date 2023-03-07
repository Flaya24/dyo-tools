const expect = require('expect')
const { Given, When, Then } = require('@cucumber/cucumber')
const {DTManager, DTPlayer, DTBunch, DTElement} = require("../../../dist/src");
const initializeDominionManager = require("../resources/dominion");
const {transformDataTableToBunchFinderArgs} = require("../resources/utils");

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
    this.manager.add(this.current);
})

Then('I should see an error', function () {
    expect(this.manager.getLastError().getCode()).toBe('id_conflict');
});

Then('I should find my current hand', function (pred) {
    expect(this.manager.get(this.current.getId()).getId()).toBe(this.current.getId());
})

Then('I shouldn\'t find my current hand', function (pred) {
    expect(this.manager.get(this.current.getId())).toBeUndefined();
})

Then('I should find {int} bunches with', function (nbBunches, table) {
    const findArgs = transformDataTableToBunchFinderArgs(table);
    expect(this.manager.find(findArgs).length).toBe(nbBunches);
})

When('I remove my current hand', function () {
    this.manager.remove(this.current.getId());
})

Then('I should have {int} elements in my library', function (nbElements) {
    expect(this.manager.getLibrary().getAll().length).toBe(nbElements);
})

When('I add a new trash pile with 2 already existing elements', function () {
    const coppers = this.manager.getLibrary().find({ key: { $eq: 'COPPER' }});
    const trashPile = new DTBunch('trash', [
        new DTElement('CURSE'),
        new DTElement('CURSE'),
        new DTElement('CURSE'),
        coppers[0],
        coppers[1]
    ]);
    this.manager.add(trashPile);
})

Then('I shouldn\'t find my library id into bunches', function () {
    const libraryId = this.manager.getLibrary().getId();
    expect(this.manager.get(libraryId)).toBeUndefined();
})

When('I add a new external card in my current hand', function () {
    const curseCard = new DTElement('CURSE');
    this.current.add(curseCard);
})



