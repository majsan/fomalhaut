<template>
  <div id="app">
    <ModeChooser @router="update" :globals="globals"/>
    <div class="row">
      <div class="col-md-4">
        <b-card no-body>
          <b-tabs pills card :value="selectedTabIndex" @input="updateTabParam($event)">
            <b-tab :title="loc('tabs.query')" title-link-class="viewing-tab-link">
              <Search @router="update" :globals="globals" :results="results"/>
            </b-tab>
            <b-tab
              title-link-class="viewing-tab-link">
              <template slot="title">
                <span>{{loc('tabs.hits')}}
                </span>
              </template>
              <b-badge
                :class="{'badge-success': total > 0, 'badge-secondary': total === 0}"
                pill>{{total}}</b-badge>
              <List @router="update" @collection="saveSearchAsCollection" :globals="globals" :results="results"/>
            </b-tab>
            <b-tab :title="loc('tabs.collections')" title-link-class="viewing-tab-link">
              <Collections @router="update" :globals="globals"/>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
      <div class="col-md-8 right-column">
        <Display :globals="globals" @router="update"/>
      </div>
    </div>
  </div>
</template>

<script>
import LexiconService from './services/LexiconService'
import ModeChooser from './components/ModeChooser'
import LexiconsChooser from './components/LexiconsChooser'
import Search from './components/Search'
import List from './components/List'
import Collections from './components/Collections'
import Display from './components/Display'
import Edit from './components/Edit'
import RestResource from './services/RestResource'
import LocalDatabase from './services/LocalDatabase'
import Localize from './Localize'

export default {
  name: 'app',
  components: {
    ModeChooser,
    LexiconsChooser,
    Search,
    List,
    Collections,
    Display,
    Edit
  },
  mixins: [Localize],
  data () {
    return {
      results: null,
      total: 0,
      parameters: {
        'mode': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.mode = newValue
          }
        },
        'resources': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.lexicons = newValue.split(',')
            this.search(newValue.split(','), this.globals.hot.query, this.globals.hot.page, this.globals.hot.hpp)
          }
        },
        'tab': {
          history: false,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.tab = newValue
          }
        },
        'query': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.query = newValue
            this.search(this.globals.hot.lexicons, newValue, this.globals.hot.page, this.globals.hot.hpp)
          }
        },
        'hpp': {
          history: false,
          type: 'NUMBER',
          onChange: (newValue) => {
            this.globals.hot.hpp = newValue
          }
        },
        'page': {
          history: true,
          type: 'NUMBER',
          defaultValue: '1',
          onChange: (newValue, preventAction) => {
            this.globals.hot.page = newValue
            if (! preventAction) {
              this.search(this.globals.hot.lexicons, this.globals.hot.query, newValue, this.globals.hot.hpp)
            }
          }
        },
        'lang': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            this.globals.hot.GUILang = newValue
          },
          defaultValue: 'swe'
        },
        'extra': {
          history: false,
          type: 'STRING'
        },
        'show': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            if (newValue) {
              this.globals.hot.entries = newValue.split('|')
            } else {
              this.globals.hot.entries = []
            }
          }
        },
        'pinned': {
          history: true,
          type: 'STRING',
          onChange: (newValue) => {
            if (newValue) {
              this.globals.hot.pinned = newValue.split('|')
            } else {
              this.globals.hot.pinned = []
            }
          }
        }
      },
      globals : {
        cold: {
          translations : { /* TODO: Move somewhere else */
            'tabs.query': {'swe': 'Sökfråga', 'eng': 'Query'},
            'tabs.hits': {'swe': 'Träffar', 'eng': 'Hits'},
            'tabs.collections': {'swe': 'Samlingar', 'eng': 'Collections'},
            'tabs.viewing': {'swe': 'Visning', 'eng': 'Viewing'},
            'tabs.editing': {'swe': 'Redigering', 'eng': 'Editing'},
            'string': {'swe': 'sträng', 'eng': 'string'},
            'search': {'swe': 'Sök', 'eng': 'Search'},
            'search.simple': {'swe': 'Enkel', 'eng': 'Simple'},
            'search.extended': {'swe': 'Utökad', 'eng': 'Extended'},
            'search.enter_wordform': {'swe': 'text här', 'eng': 'enter text here'},
            'search.find_entries_where': {'swe': 'Hitta ingångar där', 'eng': 'Find entries where'},
            'search.add_constraint': {'swe': 'Lägg till villkor', 'eng': 'Add constraint'},
            'search.show_hits': {'swe': 'Visa träffarna', 'eng': 'Display Hits'},
            'operator.and': {'swe': 'och', 'eng': 'and'},
            'operator.not': {'swe': 'utom', 'eng': 'not'},
            'operator.or': {'swe': 'eller', 'eng': 'or'},
            'hits.save_as_collection': {'swe': 'Spara som samling', 'eng': 'Save as collection'},
            'editor.save': {'swe': 'Spara', 'eng': 'Save'},
            'login': {'swe': 'Logga in', 'eng': 'Log in'},
            'logout': {'swe': 'Logga ut', 'eng': 'Log out'},
            'about_karp': {'swe': 'Om Karp', 'eng': 'About Karp'},
            'THOUSANDS_SEPARATOR': {'swe': ' ', 'eng': ','}
          },
          lexicons: {
            'saldo': {
              title: 'Saldo',
              local: false // All predifined lexicons are probably local? (Unless we predefine lexicons that are empty. IT COULD HAPPEN.)
            }
          },
          sets: {},
          highlightMap: {}
        },
        hot: { // Change detected globals
          GUILang: 'swe',
          lexicons: [],
          query: null,
          tab: 'query',
          searching: false,
          entries: [],
          pinned: [],
          savedCollections: [],
          mode: 'DEFAULT',
          hpp: 25,
          page: 1,
          username: null,
          password: null
        }
      }
    }
  },
  watch: {
    'results.hits': function(newValue) {
      console.log("WATCHED", newValue)
      this.total = newValue.total
    }
  },
  computed: {
    selectedTabIndex: function() {   
      if (this.globals.hot.tab) {
        return ['query', 'hits', 'collections'].indexOf(this.globals.hot.tab)
      } else {
        return 0
      }
    }
  },
  methods: {
    numberOfResults: function() {
      if (this.results) {
        return this.groupNumbers(this.results.hits.total)
      } else {
        return '0'
      }
    },
    diffObjects: function(object, base) { // TODO: Move to some other file perhaps
      // REM: This doesn't seem to work with non-existant keys
      /**
       * Deep diff between two object, using lodash
       * @param  {Object} object Object compared
       * @param  {Object} base   Object to compare with
       * @return {Object}        Return a new object who represent the diff
       */
      function changes(object, base) {
        return _.transform(object, function(result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
          }
        })
      }
      return changes(object, base)
    },
    saveSearchAsCollection: function(event) {
      console.log("save current search as a new collection.", this.lastQuery)
      // So far we only use the first lexicon even if the search was in more than one
      // and so far we only save it to memory (no local storage or database connection)
      this.globals.hot.savedCollections.push({lexicons: this.lastLexicons, query: this.lastQuery, name: 'saved query'})
    },
    search: function(lexicons, query, page=1, hpp=25) {
      console.log("should perform search", lexicons, query, page, hpp)
      //if (page === undefined || page === null) page = 1;
      this.lastQuery = query
      this.lastLexicons = lexicons
      // There is the possibility that one or more of the lexicons are local lexicons.
      // We need to handle them differently.
      const restResourceService = RestResource
      this.globals.hot.searching = true
      this.$nextTick()
      // Always start with the external lexicons for performance reasons
      let http = restResourceService.sendRequest(lexicons, query, page, hpp)
      let that = this
      http.then((response) => {
        that.results = response.data
        that.generateHighlightMap(that.results)
        console.log("that.results", that.results)
      }).catch((response) => {
        // error
        console.log("A search error occured", response)
        that.results = {hits: {hits: [], total: 0}}
      }).finally(() => {
        console.log("running")
        that.$nextTick(function() { that.globals.hot.searching = false })
      })

      /* this.hits = [query, query + "2", query + "3"]
      const restResourceService = new RestResource()
      restResourceService.sendRequest()
      const localDatabase = new LocalDatabase()
      localDatabase.addLexicon("A")
      localDatabase.addLexicon("B")
      localDatabase.removeLexicon("A")
      console.log(localDatabase.lexicons); */
    },
    generateHighlightMap: function(results) {
      /* Takes the result from the backend and makes a map of the highlight data
         where the keys are the es-ids and the values are the highlight entries */
      let highlightMap = {};
      if (results.hits.highlight && results.hits.total !== 0) {
        //for (let i = 0; i < results.hits.hits.length; i++) {
        //  highlightMap[results.hits.hits[i]._id] = results.highlight[i]
        //}
        for (let hit of results.hits.hits) {
          highlightMap[hit._id] = hit.highlight
        }
      }
      this.globals.cold.highlightMap = highlightMap
    },
    update: function(actions) {
      /*
        Multiple actions let's several changes become only one history entry

        actions = [{
          param: "query",
          value: "simple||apa"
        }, ...]
      */
      let state = window.history.state || {}
      let newHistoryEntry = false
      for (let action of actions) {
        let param = this.parameters[action.param]
        if (action.value === param.defaultValue) {
          delete state[action.param]
        } else {
          state[action.param] = action.value
        }
        
        newHistoryEntry = newHistoryEntry || param.history
      }

      if (newHistoryEntry)
        window.history.pushState(state, "dummy", this.buildURL(state));
      else
        window.history.replaceState(state, "dummy", this.buildURL(state));

      this.syncAppState(state)

    },
    updateTabParam : function(index) {
      this.update([{param: 'tab', value: ['query', 'hits', 'collections'][index]}])
    },
    buildURL: function(state) {
      return "?" + _.map(_.keys(state), (key) => { return key + "=" + state[key] }).join("&")
    },
    syncAppState: function(state) {
      // Should update the internal state of the application to the provided one.
      // It's either called after the update function has been called by a component
      // or from the window.onpopstate function to make sure the app state is synced

      // IT IS IN THIS METHOD THAT ACTIONS LIKE SEARCHING SHOULD BE INITIATED, NOT IN
      // THE UPDATE FUNCTION SINCE SINCE IT IS NOT RUN ON PAGE LOAD OR BACK/FORWARD ACTIONS

      let oldState = window.lastHistoryState || {}

      let diff = this.diffObjects(state, oldState)
      let invertedDiff = this.diffObjects(oldState, state)

      //console.log("diff", diff, invertedDiff)

      let handled = {};
      for (let paramID in diff) {
        handled[paramID] = true
        this.syncParam(this.parameters[paramID], state[paramID])
      }
      for (let paramID in invertedDiff) {
        if (!handled[paramID]) {
          // Deleted item (i.e. an item that has changed back to the default)
          let param = this.parameters[paramID]
          this.syncParam(param, param.defaultValue)
        }
      }

      window.lastHistoryState = state
    },
    syncParam: function(param, newValue) {
      let convertedParamValue = this.convertParamValue(newValue, param.type)
      if (param.onChange) param.onChange(convertedParamValue, param.preventAction || false)
    },
    convertParamValue: function(inValue, type) {
      if (!type) type = 'STRING';
      switch(type) {
        case 'STRING':
          return inValue
        case 'NUMBER':
          return Number(inValue)
      }
    },
    makeStartingState: function() {
      let url = window.location.search
      let state = {}
      if (_.includes(url, "?")) {
        url = url.split("?")[1] // Maybe needs some tweaking
        let parts = url.split("&")
        for (let part of parts) {
          let [key, value] = part.split("=")
          state[key] = value
          window.history.replaceState(state, "init")
        }
      } else {
        // Maybe use some default state
      }
      this.syncAppState(state)
    },
    initModes: function() {
      let modes = {}
      let modeSettings = window.settings.modes
      if (modeSettings) {
        for (let key in modeSettings) {
          let modeDef = modeSettings[key]
          modes[key] = {
            id: key,
            title: modeDef.title || '',
            infoHTML: modeDef.infoHTML || '', // TODO: Also allow only 'info' (more lightweight)
            lexicons: modeDef.lexicons || [],
            color: modeDef.color || 'black',
            image: modeDef.image || null
          }
          if (_.size(modeSettings) === 1) { // A bit strange but works
            this.globals.hot.mode = key
          }
        }
      }
      this.globals.cold.modes = modes // REM: Defaults to single-mode if modes.length === 0
    },
    initLanguages: function() {
      let languages = [];
      let langSettings = window.settings.languages
      if (langSettings) {
        for (let lang of langSettings) {
          languages.push({
            isoCode: lang.isoCode,
            nativeName: lang.nativeName || 'missing language name'
          })
        }
      } else {
        // Default to english only
        languages.push({
          isoCode: 'eng',
          nativeName: 'english'
        })
      }
      this.globals.cold.languages = languages
    },
    initLexicons: function() {
      let lexicons = {}
      for (let lexicon of window.lexicons) {
        LexiconService.augmentLexiconDefinitionWithPaths(lexicon.structure, '')
        lexicon['keywords'] = LexiconService.getSearchKeywordsForLexicon(lexicon)
        lexicon['byColumn'] = LexiconService.getColumns(lexicon) // To be removed
        lexicon['asTables'] = LexiconService.getTabularRepresentation(lexicon)
        _.extend(this.globals.cold.sets, LexiconService.loadSets(lexicon))
        console.log("Read definition for the lexicon", lexicon.id, lexicon)
        lexicons[lexicon.id] = lexicon
      }
      this.globals.cold.lexicons = lexicons
      this.globals.hot.lexicons = _.keys(lexicons) // Pre-select all lexicons without changing the URL
    },
    newEntry: function() {

    }
  },
  created: function() {
    this.$watch('globals.hot', function() { this.$nextTick() }, {deep: true} )

    let that = this

    // Initialize the modes (with info from config.js)
    this.initModes()

    // Initialize the languages (with info from config.js)
    this.initLanguages()

    // Initialize the lexicon definitions in window.lexicons
    this.initLexicons()


    window.onpopstate = function(event) {
      if (event.state) {
        that.syncAppState(event.state)
      } else {
        that.makeStartingState()
      }
    }
    // Set up URL to default parameters:
    this.makeStartingState()
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }
  .right-column {
    padding-right: 4px;
    padding-left: 0px;
  }
</style>
