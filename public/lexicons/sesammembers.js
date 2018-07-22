window.lexicons.push({
  id: 'sesammembers',
  name: {
    'all': 'Sesam medlemsregister'
  },
  tabs: ["Medlem", "Adress"],
  view: 'COLUMNS',
  structure: {
    table: 1,
    label: {
      'swe': 'Medlem',
      'eng': 'Member'
    },
    noRow: true,
    properties: {
      'mnr': {
        label: {
          'swe': 'Medlemsnummer',
          'eng': '-'
        },
        search: 'mnr',
        column: 1,
        tab: 0,
        main: true
      },
      'name': {
        label: {
          'swe': 'Namn',
          'eng': '-'
        },
        properties: {
          "name": {
            search: 'name.fullname',
            label: {
              'swe': 'Fullständigt namn',
              'eng': '-'
            }
          },
          "firstname": {
            label: {
              'swe': 'Förnamn',
              'eng': '-'
            },
            search: 'name.firstname',
            tab: 0,
            column: 2
          },
          "lastname": {
            label: {
              'swe': 'Efternamn',
              'eng': '-'
            },
            search: 'name.lastname',
            tab: 0,
            column: 3
          }
        }
      },
      'paid': {
        label: {
          'swe': 'Betalat',
          'eng': '-'
        },
        search: 'paid',
        column: 4,
        tab: 0
      },
      'familymember': {
        properties: {
          'name': {
            label: {
              'swe': 'Familjemedlem, namn',
              'eng': '-'
            },
            column: 5,
            tab: 0,
          },
          'paid': {
            label: {
              'swe': 'Familjemedlem, betalat',
              'eng': '-'
            },
            column: 6,
            tab: 0
          }
        }
      },
      'adress': {
        properties: {
          'co': {
            label: {
              'swe': 'Adress, co',
              'eng': '-'
            },
            tab: 1,
            column: 7
          },
          'line1': {
            label: {
              'swe': 'Adress, rad 1',
              'eng': '-'
            },
            tab: 1,
            column: 8
          },
          'line2': {
            label: {
              'swe': 'Adress, rad 2',
              'eng': '-'
            },
            tab: 1,
            column: 9
          },
          'zipcode': {
            label: {
              'swe': 'Adress, postnummer',
              'eng': '-'
            },
            tab: 1,
            column: 10
          },
          'city': {
            label: {
              'swe': 'Adress, stad',
              'eng': '-'
            },
            column: 11
          },
          'country': {
            label: {
              'swe': 'Adress, land',
              'eng': '-'
            },
            tab: 1,
            column: 12
          },
          'email': {
            label: {
              'swe': 'E-post',
              'eng': '-'
            },
            tab: 1,
            column: 13
          },
          'telephone': {
            label: {
              'swe': 'Telefonnummer',
              'eng': '-'
            },
            tab: 1,
            column: 14
          }
        }
      },
      'gesall': {
        label: {
          'swe': 'Gesäll',
          'eng': '-'
        },
        tab: 0,
        column: 15
      },
      'alderman': {
        label: {
          'swe': 'Ålderman',
          'eng': '-'
        },
        tab: 0,
        column: 16
      },
      'otherinfo': {
        label: {
          'swe': 'Övrig info',
          'eng': '-'
        },
        tab: 0,
        column: 17
      }
    }
  }
});
