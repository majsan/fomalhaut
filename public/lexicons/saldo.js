let saldoRenderFunction = function(data) {
  let parts = data.split("..")
  return parts[0] + (parts[1] === '1' ? '' : '<sup>' + parts[1] + '</sup>')
}

window.lexicons.push({
  id: 'saldo',
  name: {
    'all': 'Saldo'
  },
  view: "COLUMNS",
  tabs: [{'swe': 'Viktigaste', 'eng': 'Most important'}, {'swe': 'Mindre viktigt crap', 'eng': 'Less important junk'}],
  structure: {
    properties: {
      'FormRepresentations': {
        label: 'FormRepresentations',
        quantity: '*',
        properties: {
          'baseform': {
            label: {
              'swe': 'Grundform',
              'eng': 'Baseform'
            },
            search: [
              {keyword: 'gf', label: {'swe': 'Ord i grundform', 'eng': 'Word in baseform'}},
              'baseformC',
              {keyword: 'wf', label: {'swe': 'Ord i ordform', 'eng': 'Word in wordform'}},
              'wfC'
            ]
          },
          'lemgram': {
            label: {
              'all': 'Lemgram'
            },
            search: 'lemgram',
            column: 2,
            tab: 0
          },
          'paradigm': {
            label: {
              'all': 'Paradigm'
            },
            operators: ['equals', 'startswith', 'endswith', 'regexp'],
            search: 'paradigm',
            column: 4,
            tab: 0
          },
          'partOfSpeech': {
            label: {
              'swe': 'Ordklass',
              'eng': 'Part-of-speech'
            },
            search: 'pos',
            column: 3,
            tab: 0,
            set: 'SALDO-POS'
          }
        }
      } ,
      'Sense': {
        label: 'Betydelse',
        properties: {
          'SenseRelations': {
            properties: {
              'primary': {
                label: {
                  'swe': 'Primär deskriptor',
                  'eng': 'Primary descriptor'
                },
                search: 'primary',
                column: 5,
                tab: 1,
                render: saldoRenderFunction
              },
              'primary_children': {
                deduced: true,
                label: {
                  'swe': 'Primära barn',
                  'eng': 'Primary children'
                },
                search: 'primaryChildren',
                column: 7,
                tab: 1,
                ellipsis: 3,
                render: saldoRenderFunction
              },
              'secondary': {
                label: {
                  'swe': 'Sekundär deskriptor',
                  'eng': 'Secondary descriptor'
                },
                search: 'secondary',
                column: 6,
                tab: 1,
                render: saldoRenderFunction
              },
              'secondary_children': {
                deduced: true,
                label: {
                  'swe': 'Sekundära barn',
                  'eng': 'Secondary children'
                },
                search: 'secondaryChildren',
                column: 8,
                tab: 1,
                ellipsis: 3,
                render: saldoRenderFunction
              }
            }
          },
          'senseid': {
            main: true,
            label: {
              'swe': 'Betydelse-ID',
              'eng': 'Sense ID'
            },
            search: [{keyword: 'sense', op: ['equals', 'startswith', 'endswith', 'regexp']}], // (The Default),
            column: 1,
            render: saldoRenderFunction
          }
        }
      }
    }
  },
  sets: {
    'SALDO-POS' : {
      type: 'CLOSED',
      values : [
        {id: 'nn' , t: {'swe': 'substantiv', 'eng': 'noun'}},
        {id: 'av' , t: {'swe': 'adjektiv', 'eng': 'adjective'}},
        {id: 'vb' , t: {'all': 'verb'}},
        {id: 'pm' , t: {'swe': 'egennamn', 'eng': 'proper noun'}},
        {id: 'ab' , t: {'all': 'adverb'}},
        {id: 'in' , t: {'swe': 'interjektion', 'eng': 'interjection'}},
        {id: 'pp' , t: {'all': 'preposition'}},
        {id: 'nl' , t: {'all': 'numeral'}},
        {id: 'pn' , t: {'swe': 'pronomen', 'eng': 'pronoun'}},
        {id: 'sn' , t: {'swe': 'subjunktion', 'eng': 'subjunction'}},
        {id: 'kn' , t: {'swe': 'konjunktion', 'eng': 'conjunction'}},
        {id: 'al' , t: {'swe': 'artikel', 'eng': 'article'}},
        {id: 'ie' , t: {'swe': 'infinitivmärke', 'eng': 'infinitive particle'}},
        {id: 'mxc', t: {'swe': 'flerordsprefix', 'eng': 'multiword prefix'}},
        {id: 'sxc', t: {'all': 'prefix'}},
        {id: 'abh', t: {'swe': 'adverbsuffix', 'eng': 'adverb suffix'}},
        {id: 'avh', t: {'swe': 'adjektivsuffix', 'eng': 'adjective suffix'}},
        {id: 'nnh', t: {'swe': 'substantivsuffix', 'eng': 'noun suffix'}},
        {id: 'nnm', t: {'swe': 'substantiv, flerording', 'eng': 'multiword noun'}},
        {id: 'nna', t: {'swe': 'substantiv, förkortning', 'eng': 'noun, abbreviation'}},
        {id: 'avm', t: {'swe': 'adjektiv, flerording', 'eng': 'multiword adjective'}},
        {id: 'ava', t: {'swe': 'adjektiv, förkortning', 'eng': 'adjective, abbreviation'}},
        {id: 'vbm', t: {'swe': 'verb, flerording', 'eng': 'multiword verb'}},
        {id: 'vba', t: {'swe': 'verb, förkortning', 'eng': 'verb, abbreviation'}},
        {id: 'pmm', t: {'swe': 'egennamn, flerording', 'eng': 'multiword proper noun'}},
        {id: 'pma', t: {'swe': 'egennamn, förkortning', 'eng': 'proper noun, abbreviation'}},
        {id: 'abm', t: {'swe': 'adverb, flerording', 'eng': 'multiword adverb'}},
        {id: 'aba', t: {'swe': 'adverb, förkortning', 'eng': 'adverb, abbreviation'}},
        {id: 'pnm', t: {'swe': 'pronomen, flerording', 'eng': 'multiword pronoun'}},
        {id: 'inm', t: {'swe': 'interjektion, flerording', 'eng': 'multiword interjection'}},
        {id: 'ppm', t: {'swe': 'preposition, flerording', 'eng': 'multiword preposition'}},
        {id: 'ppa', t: {'swe': 'preposition, förkortning', 'eng': 'preposition, abbreviation'}},
        {id: 'nlm', t: {'swe': 'numeral, flerording', 'eng': 'numeral, multiword'}},
        {id: 'knm', t: {'swe': 'konjunktion, flerording', 'eng': 'multiword conjunction'}},
        {id: 'snm', t: {'swe': 'subjunktion, flerording', 'eng': 'multiword subjunction'}},
        {id: 'kna', t: {'swe': 'konjunktion, förkortning', 'eng': 'conjunction, abbreviation'}},
        {id: 'ssm', t: {'swe': 'flerording', 'eng': 'multiword'}},
        {id: 'e',   t: {'all': 'e'}}
      ]
    }
  }
});