window.lexicons.push({
  id: 'saldom',
  name: {
    'swe': 'Saldos morfologi',
    'eng': 'Saldo morphology'
  },
  view: "COLUMNS",
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
            extra: "KORP",
            main: true
          },
          'paradigm': {
            label: {
              'all': 'Paradigm'
            },
            operators: ['equals', 'startswith', 'endswith', 'regexp'],
            search: 'paradigm',
            column: 4
          },
          'partOfSpeech': {
            label: {
              'swe': 'Ordklass',
              'eng': 'Part-of-speech'
            },
            search: 'pos',
            column: 3,
            set: 'SALDO-POS'
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