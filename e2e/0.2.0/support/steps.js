const expect = require('expect')
const { Given, When, Then } = require('@cucumber/cucumber')
const {DTManager, DTPlayer} = require("../../../dist/src");
const { emptyBunch, emptyVirtualBunch, pentacleBunch} = require("./factory");

Given('my empty manager', function () {
    this.manager = new DTManager('epicManager', [], [], { errors: true });
})

Given('my basic manager', function () {
    this.manager = new DTManager('epicManager', [], [], { errors: true });
    this.manager.addMany([
       pentacleBunch('deck'),
       emptyBunch('discard'),
       emptyVirtualBunch('virtualTrash'),
    ]);
})

Given('my extended manager', function () {
    this.players = {
        'Priam': new DTPlayer('Priam'),
        'Ectesiam': new DTPlayer('Ectesiam'),
        'Axelle': new DTPlayer('Axelle'),
        'Morgane': new DTPlayer('Morgane'),
    }
    this.manager = new DTManager('epicManager', [], [], { errors: true });
    this.manager.addMany([
        pentacleBunch('deck'),
        emptyBunch('discard'),
        emptyVirtualBunch('virtualTrash'),
    ]);
})

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


