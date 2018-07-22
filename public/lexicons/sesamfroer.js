window.lexicons.push({
  id: 'sesamfroer',
  name: {
    'all': 'Sesam frökatalog'
  },
  tabs: ["Frö", "Medlem", "Korsningsrisk"],
  view: 'COLUMNS',
  structure: {
    table: 1,
    label: {
      'swe': 'Fröer',
      'eng': 'Seeds'
    },
    noRow: true,
    properties: {
      'species': {
        label: {
          'swe': 'Art',
          'eng': '-'
        },
        search: 'species',
        column: 1,
        tab: 0,
        main: true
      },
      'description': {
        label: {
          'swe': 'Beskrivning',
          'eng': '-'
        },
        search: 'description',
        column: 7,
        tab: 0
      },
      'latin': {
        label: {
          'swe': 'Latin',
          'eng': '-'
        },
        search: 'latin',
        column: 4,
        tab: 0
      },
      'family': {
        label: {
          'swe': 'Familj',
          'eng': '-'
        },
        search: 'genus',
        column: 5,
        tab: 0
      },
      'genus': {
        label: {
          'swe': 'Släkte',
          'eng': '-'
        },
        search: 'genus',
        column: 6,
        tab: 0
      },
      'cultivar': {
        label: {
          'swe': 'Sortnamn',
          'eng': '-'
        },
        search: 'cultivar',
        column: 7,
        tab: 0
      },
      'zone': {
        label: {
          'swe': 'Zon',
          'eng': '-'
        },
        search: 'zon',
        column: 3,
        tab: 0
      },
      'age': {
        label: {
          'swe': 'Årighet',
          'eng': '-'
        },
        search: 'age',
        column: 8,
        tab: 0
      },
      'mnr': {
        label: {
          'swe': 'Medlemsnummer',
          'eng': '-'
        },
        search: 'mnr',
        column: 9,
        tab: 1
      },
      'hybrid_risk': {
        label: 'Korsning',
        properties: {
          'comment': {
            label: {
              'swe': 'Kommentar',
              'eng': '-'
            },
            search: 'hybrid_risk.comment',
            column: 10,
            tab: 2
          },
          'risk': {
            label: 'Korsningsrisk',
            search: 'hybrid_risk.risk',
            column: 11,
            tab: 2,
            render: function(risk) {
              if (risk === 'high') {
                return '<span class="badge badge-danger">hög</span>'
              } else if (risk === "medium") {
                return '<span class="badge badge-warning">mellan</span>'
              } else if (risk === "low") {
                return '<span class="badge badge-success">låg</span>'
              }
            }
          },
          'self-pollination': {
            label: 'Självpollinerande',
            search: 'hybrid_risk.self-pollination',
            column: 12,
            tab: 2,
            render: function(aBool) {
              if (aBool) {
                return "ja"
              } else {
                return "nej"
              }
            }
          },
          'specices': {
            label: 'Arter',
            search: 'hybrid_risk.specices',
            column: 13,
            tab: 2
          }
        }
      }
    }
  }
});
