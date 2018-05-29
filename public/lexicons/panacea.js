window.lexicons.push({
  id: 'panacea',
  name: {
    'all': 'Panacea'
  },
  view: "TABULAR",
  structure: {
    table: 1,
    label: {
      'swe': 'Tyska',
      'eng': 'German'
    },
    noRow: true,
    properties: {
      'lemma_german': {
        label: {
          'swe': 'Tyskt lemma',
          'eng': 'German Lemma'
        },
        editAs: 'TEXT',
        search: 'baseform',
        column: 1,
        main: true
      },
      'pos_german': {
        label: {
          'swe': 'Tysk ordklass',
          'eng': 'German Part-of-speech'
        },
        editAs: 'TEXT',
        search: 'pos',
        set: 'PANACEA-POS',
        column: 2
      },
      'english': {
        label: {
          'swe': 'Engelska',
          'eng': 'English'
        },
        quantity: '*',
        table: 2,
        noRow: true,
        properties: {
          'lemma_english': {
            label: {
              'swe': 'Lemma',
              'eng': 'Lemma'
            },
            editAs: 'TEXT',
            search: 'baseform_en',
            column: 1
          },
          'pos_english': {
            label: {
              'swe': 'Ordklass',
              'eng': 'Part-of-speech'
            },
            editAs: {component: 'DROPDOWN', set: 'POS'},
            search: 'pos_en',
            set: 'PANACEA-POS',
            column: 2
          },
          'corpus_prob': {
            label: {
              'swe': 'Korpussannolikhet',
              'eng': 'Corpus Probability'
            },
            editAs: 'TEXT',
            search: 'corpus_prob',
            column: 3
          },
          'package_prob': {
            label: {
              'swe': 'Sannolikhet',
              'eng': 'Package Probability'
            },
            editAs: 'TEXT',
            operators: ['equals', 'startswith', 'endswith', 'regexp'],
            search: 'package_prob',
            column: 4
          },
          'target_prob': {
            label: {
              'swe': 'Målsannolikhet',
              'eng': 'Target Probability'
            },
            editAs: {component: 'DROPDOWN', set: 'POS'},
            search: 'target_prob',
            column: 5
          }
        }
      }
    }
  },
  sets: {
    'PANACEA-POS' : {
      type: 'CLOSED',
      values : [
        {id: 'No' , t: {'swe': 'substantiv', 'eng': 'noun'}},
        {id: 'Ad' , t: {'swe': 'adjektiv', 'eng': 'adjective'}},
        {id: 'Vb' , t: {'all': 'verb'}}
      ]
    }
  }
});