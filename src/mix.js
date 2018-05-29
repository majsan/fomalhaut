import * as _ from 'lodash'
import Localize from './Localize'
export default {
  props: ['globals'],
  mixins: [Localize],
  created: function() {
    this.$watch('globals.hot', function() { this.$nextTick() }, {deep: true} )
  },
  methods: {
    update: function(p1, p2) {
      /* 
        Callable with:
          update({param: "lang", value: "swe"})
          update([{param: "lang", value: "swe"}])
          update("query", "swe")
      */
      let updates = []
      if (p2 !== undefined) {
        updates = [{param: p1, value: p2}]
      } else {
        if (_.isArray(p1)) {
          updates = p1
        } else {
          updates = [p1]
        }
      }
      this.$emit('router', updates)
    },
    pickLabel: function(hit) {
      if (this.globals.cold.lexicons[hit._source.lexiconName]) {
        let lexicon = this.globals.cold.lexicons[hit._source.lexiconName]
        let keyword = _.find(lexicon.keywords, (kw) => kw.main)
        let label = this.pick(hit._source, keyword.path)
        return label || hit._id
      } else {
        console.log('%cMissing lexicon configuration for: ' + hit._source.lexiconName, 'color: orange')
        return hit._id
      }
    },
    pick: function(structure, path, wholeArray) {
      let items = path.split('.')

      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        if (item.length !== 0) {
          structure = structure[item]
          if (structure === undefined) return null;
          if (_.isArray(structure)) {
            if (wholeArray && (i === (items.length - 1))) {
              
            } else {
              if (structure.length === 0) return null;
              structure = structure[0]
            }
          }
        }
      }
      return structure
    },
    augmentModel: function(entry) {
      let copy = _.cloneDeep(entry._source) // We keep any unexpected data unaltered
      let struct = this.globals.cold.lexicons[entry._source.lexiconName].structure
      this.augmentBranch(struct, copy)
      return copy
    },
    augmentBranch: function(definition, branch) {
      if (definition.properties) {
        for (let propertyName in definition.properties) {
          let child = branch[propertyName]
          let output = null
          if (child) {
            if (!_.isArray(child)) {
              branch[propertyName] = [child]
            }
            for (let item of branch[propertyName]) {
              this.augmentBranch(definition.properties[propertyName], item)
            }
          } else {
            let def = definition.properties[propertyName]
            if (!def.quantity || def.quantity === 1 || def.quantity === '.') {
              if (!def.quantity || def.quantity === 'STRING') {
                output = ['']
              }
            } else {
              output = []
            }
            branch[propertyName] = output
          }
        }
      }
    }
  }
  
}

/*
  TIP: <another v-on:router="update"/> will send the event to the next level.
*/