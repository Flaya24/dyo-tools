const {DTElement, DTManager, DTBunch, DTPlayer} = require("../../../dist/src");

/****************** CARDS REFERENCE ************************/
const cards = {
    "COPPER": {
        meta: {
            type: 'treasure',
            cost: 0,
            treasurePoints: 1
        },
        events: {
          play: (ctx) => {
              ctx.getOwner.setMeta('coin', 1);
          }
        }
    },
    "SILVER": {
        meta: {
            type: 'treasure',
            cost: 3,
            treasurePoints: 2
        },
        events: {
            play: (ctx) => {
                ctx.getOwner.setMeta('coin', 2);
            }
        }
    },
    "GOLD": {
        meta: {
            type: 'treasure',
            cost: 6,
            treasurePoints: 3
        },
        events: {
            play: (ctx) => {
                ctx.getOwner.setMeta('coin', 3);
            }
        }
    },
    "ESTATE": {
        meta: {
            type: 'victory',
            cost: 2,
            victoryPoints: 1
        }
    },
    "DUCHY": {
        meta: {
            type: 'victory',
            cost: 5,
            treasurePoints: 3
        }
    },
    "PROVINCE": {
        meta: {
            type: 'victory',
            cost: 8,
            treasurePoints: 6
        }
    },
    "SMITHY": {
        meta: {
            type: 'action',
            cost: 4,
        }
    },
    "WORKSHOP": {
        meta: {
            type: 'action',
            cost: 3,
        }
    },
    "MILITIA": {
        meta: {
            type: 'action',
            cost: 4,
        }
    },
}

/****************** BUILDERS ************************/

const buildCard = (key) => {
    const element = new DTElement(key);
    element.setManyMeta(cards[key].meta);
    if (cards[key].events) {
        for (let actionKey of Object.keys(cards[key].events)) {
            element.addEvent(actionKey, cards[key].events[actionKey]);
        }
    }
    return element;
}

const duplicateCard = (card, nb) => {
    const items = [card];
    let i = 1;
    while (i <= nb) {
        items.push(card.copy());
        i++;
    }
    return items;
}

const initializeDominionManager = () => {
    const scopes = [
        'supply',
        'hand',
        'playZone',
        'discard',
        'deck'
    ];
    const library = [
        ...duplicateCard(buildCard('COPPER'), 13),
        ...duplicateCard(buildCard('ESTATE'), 5)
    ];
    const manager = new DTManager('dominionCard', library, scopes, { errors: true });

    // Initialize Supply zone
    const copperPile = new DTBunch('copperPile', duplicateCard(buildCard('COPPER'), 11));
    copperPile.setMeta('cost', cards["COPPER"].cost);
    const silverPile = new DTBunch('silverPile', duplicateCard(buildCard('SILVER'), 11));
    silverPile.setMeta('cost', cards["SILVER"].cost);
    const goldPile = new DTBunch('goldPile', duplicateCard(buildCard('GOLD'), 11));
    goldPile.setMeta('cost', cards["GOLD"].cost);

    const estatePile = new DTBunch('estatePile', duplicateCard(buildCard('ESTATE'), 7));
    estatePile.setMeta('cost', cards["ESTATE"].cost);
    const duchyPile = new DTBunch('duchyPile', duplicateCard(buildCard('DUCHY'), 7));
    duchyPile.setMeta('cost', cards["DUCHY"].cost);
    const provincePile = new DTBunch('provincePile', duplicateCard(buildCard('PROVINCE'), 7));
    provincePile.setMeta('cost', cards["PROVINCE"].cost);

    const militiaPile = new DTBunch('militiaPile', duplicateCard(buildCard('MILITIA'), 7));
    militiaPile.setMeta('cost', cards["MILITIA"].cost);
    const smithyPile = new DTBunch('smithyPile', duplicateCard(buildCard('SMITHY'), 7));
    smithyPile.setMeta('cost', cards["SMITHY"].cost);
    const workshopPile = new DTBunch('workshopPile', duplicateCard(buildCard('WORKSHOP'), 7));
    workshopPile.setMeta('cost', cards["WORKSHOP"].cost);

    manager.addMany([
        copperPile,
        silverPile,
        goldPile,
        estatePile,
        duchyPile,
        provincePile,
        militiaPile,
        smithyPile,
        workshopPile
    ], 'supply');

    // Initialize players
    const players = [
        new DTPlayer('PRIAM'),
        new DTPlayer('ECTESIAM'),
    ]

    // Initialize players deck, discard and hand
    let current = {};
    for (let player of players) {
        const deck = new DTBunch('deck');
        deck.setOwner(player);
        manager.add(deck, 'deck');

        const discard = new DTBunch('discard');
        discard.setOwner(player);
        manager.add(discard, 'discard');

        const hand = new DTBunch('hand');
        hand.setOwner(player);
        manager.add(hand, 'hand');

        const playZone = new DTBunch('playZone');
        playZone.setOwner(player);
        manager.add(playZone, 'playZone');

        const playerCards = new DTBunch('playerCards', [], { virtualContext: true });
        playerCards.setOwner(player);
        manager.add(playerCards);

        if (player.getKey() === 'PRIAM') {
            current = {
                player,
                deck,
                hand,
                playZone
            }
        }
    }

    // Initialize actions
    const fakeShuffle = (bunch) => {
      const estates = bunch.find({ key: { $eq: 'ESTATE' }});
      const coppers = bunch.find({ key: { $eq: 'COPPER' }});

      bunch.removeAll();
      bunch.addMany([
          coppers[0],
          estates[0],
          coppers[1],
          estates[1],
          coppers[2],
          estates[2],
          coppers[3],
          coppers[4],
          coppers[5],
          coppers[6],
      ])
    };
    const fakeShuffleAction = new DTSimpleAction('shuffle', fakeShuffle, {
        target: 'bunch',
        scopes: ['deck']
    });

    const drawAction = new DTTransferAction('draw', {
       scopes: ['deck'],
       destinationScope: 'hand'
    });

    const playAction = new DTTransferAction('play', {
        scopes: ['hand'],
        destinationScope: 'playZone'
    });

    manager.addAction(fakeShuffleAction);
    manager.addAction(drawAction);
    manager.addAction(playAction);

    // Return
    return {
        manager,
        current,
        players
    }
}

module.exports = initializeDominionManager
