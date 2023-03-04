const expect = require('expect')
const { Given, When, Then } = require('@cucumber/cucumber')
const {DTManager, DTPlayer} = require("../../../dist/src");
const { emptyBunch, emptyVirtualBunch, standard32Bunch, standard32Elements, ownedEmptyBunch} = require("./factory");

/******************* INSTALLATION (GIVEN) STEPS *************************/

Given('my empty manager', function () {
    this.manager = new DTManager('empty-manager', [], [], { errors: true });
})

Given('my solitaire manager', function () {
    this.manager = new DTManager('solitaire-manager', [], [], { errors: true });
    this.manager.addMany([
       standard32Elements('deck'),
       emptyBunch('play-zone'),
       emptyVirtualBunch('win-stack'),
    ]);
})

Given('my bridge manager', function () {
    this.players = {
        'Priam': new DTPlayer('Priam'),
        'Ectesiam': new DTPlayer('Ectesiam'),
        'Axelle': new DTPlayer('Axelle'),
        'Morgane': new DTPlayer('Morgane'),
    }
    this.manager = new DTManager('bridge-manager', [], [], { errors: true });

    const dummyBunch = ownedEmptyBunch('hand', this.players['Axelle']);
    dummyBunch.setMeta('role', 'dummy');
    const declarerBunch = ownedEmptyBunch('hand', this.players['Priam']);
    declarerBunch.setMeta('role', 'declarer');
    this.currentHandId = declarerBunch.getId();

    this.manager.addMany([
        standard32Bunch('library'),
        emptyBunch('play-zone'),
        emptyVirtualBunch('win-stack-team1'),
        emptyVirtualBunch('win-stack-team2'),
        declarerBunch,
        ownedEmptyBunch('hand', this.players['Ectesiam']),
        dummyBunch,
        ownedEmptyBunch('hand', this.players['Morgane']),
    ]);
})

/**************************** ACT STEPS ********************************/

When('I add {int} physical bunches and {int} virtual bunches', function (nbBunches, nbVirtualBunches) {
    let i = 1;
    while (i <= nbBunches) {
        this.manager.add(emptyBunch('hand'));
        i++;
    }
    let j = 1;
    while (i <= nbVirtualBunches) {
        this.manager.add(emptyVirtualBunch('virtualHand'));
        j++;
    }
});

Then('I should have {int} bunches in my manager', function (nbBunches) {
    expect(this.manager.getAll().length).toBe(nbBunches);
});

When('I add an already existing bunch', function () {
    const existingBunch = this.manager.getAll()[0];
    this.manager.add(existingBunch);
})

Then('I should see an error', function () {
    expect(this.manager.getLastError().getCode()).toBe('id_conflict');
});


