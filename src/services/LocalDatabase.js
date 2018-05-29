import * as _ from 'lodash';

/* The query object:
    {
      lexicons: ["apa", "bpa", "cpa"],
      query: "simple||hej"
    }
*/

export default class LocalDatabase {
    constructor() {
      this.lexicons = []
    }

    addLexicon(name) {
      let lexicon = {
        name: name,
        entries: []
      }
      this.lexicons.push(lexicon)
    }

    removeLexicon(name) {
      this.lexicons = _.remove(this.lexicons, (lexicon) => lexicon.name === name)
    }

    ask(query) {
      parsedQuery = _parseQuery(query)
    }

    _parseQuery(query) {
      // TODO: Needs to take the starting modifier in account ("simple", "extended"...)
      andClauses = query.split("||")
      for (let ac in andClauses) {
        parts = ac.split("|")
        newClause = {
          type: parts[0],
          index: parts[1],
          operator: parts[2]
        }
        ors = parts.slice(3)
        orClauses = []
        for (var i = 0; i < ors.length; i++) {
          let deescapedOr = orClauses[i].replace(/__pipe__/g, "|")
          orClauses.push({
            "value": deescapedOr,
            "index": i
          })
        }
        newClause.orClauses = orClauses
        newClauses.push(newClause)
      }
    }

}