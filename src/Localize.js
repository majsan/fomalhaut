import * as _ from 'lodash'
export default {
  created: function() {},
  methods: {
    loc: function(value) {
      if (! value) {
        return ''
      }
      if (_.isString(value)) {
        let translations = this.globals.cold.translations

        if (translations[value]) {
          return translations[value][this.globals.hot.GUILang]
        } else {
          console.log('%cMissing translation: "' + value + '"', 'color:orange')
          return value
        }
      } else {
        return value[this.globals.hot.GUILang] || value.all || '-missing translation-'
      }
    },
    groupNumbers: function(input) {
      input = input.toString()
      let regex = /(\d+)(\d{3})/
      let separator = this.loc('THOUSANDS_SEPARATOR') || ','
      while (regex.test(input)) {
        input = input.replace(regex, "$1" + separator + "$2")
      }
      return input
    }
  }
  
}