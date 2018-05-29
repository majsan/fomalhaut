window.settings = {}

/* window.settings.modes = {

  'saldo': {
    title: {
      'all': 'Saldo'
    },
    color: "turqoise",
    lexicons: ['saldo', 'saldom']
  },

  'dalin': {
    title: {
      'eng': 'Dalin\'s dictionary',
      'swe': 'Dalins ordbok'
    },
    color: "red",
    image: "dalinbok.png",
    lexicons: ['dalin', 'dalinm', 'dalin-base']
  },

  'skbl': {
    title: {
      'eng': 'SKBL Online',
      'swe': 'Svenskt kvinnobiografiskt lexikon'
    },
    color: "blue",
    image: "bremer.png",
    lexicons: ['skbl']
  }

} */

window.settings.modes = {
  'saldo' : {
    title: {
      all: 'Saldo'
    },
    lexicons: ['saldo', 'saldom'],
    infoHTML: {
      swe: `SALDO (Svenskt associationslexikon 2) är en omfattande elektronisk lexikonresurs för modernt svenskt skriftspråk. Den är avsedd för användning i språkteknologisk forskning och utveckling av språkteknologiska applikationer. Den avviker därför från vad man förväntar sig att finna i traditionella lexikon avsedda för mänskligt bruk. Lexikonet är inte normativt, utan är tänkt att vara maximalt deskriptivt. Dessutom distribueras SALDO i ett format som är avsett för användning som en komponent i datorprogram. SALDO bygger på Svenskt associationslexikon (SAL), ett semantiskt lexikon för svenska. Man kan betrakta SALDO som baslexikonresursen i en svensk BLARK (Basic LAnguage Resource Kit).`,
      eng: `SALDO (Swedish Associative Thesaurus version 2) is an extensive electronic lexicon resource for modern Swedish written language. It is created for the purpose of language technology research and for the development of language technology applications. Thus, it deviates from what you expect to find in a traditional lexicon for human use. It is not a normative lexicon, but is rather meant to be maximally descriptive. Additionally, it is distributed in a form which is intended for use as a component in a computer program. SALDO builds on Swedish Associative Thesaurus (SAL), a semantic lexicon for Swedish. SALDO may be viewed as a basic lexical resource for a Swedish BLARK (Basic LAnguage Resource Kit).`
    }
  }
}
window.settings.backend = "https://ws.spraakbanken.gu.se/ws/karp/v4";

/* window.settings.modes = {
  'panacea' : {
    title: {
      swe: 'Panacea (exempellexikon)',
      eng: 'Panacea (example lexicon)'
    },
    lexicons: ['panacea'],
    infoHTML: {
      swe: `Exemplet använder data från 
            <a href="http://panacea-lr.eu/en/info-for-researchers/data-sets/bilingual-glossaries/glossary-probabilities-de-en" target="_blank">
            denna länk.</a>`,
      eng: `The example uses data from 
            <a href="http://panacea-lr.eu/en/info-for-researchers/data-sets/bilingual-glossaries/glossary-probabilities-de-en" target="_blank">
            this link.</a>`
    }
  }
} 

window.settings.backend = "http://localhost:8081/app";
*/

window.settings.languages = [
  {
    isoCode: 'swe',
    nativeName: 'Svenska'
  },
  {
    isoCode: 'eng',
    nativeName: 'English'
  }
]