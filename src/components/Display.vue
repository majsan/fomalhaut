<template>
  <div>
    <b-card no-body>
      <b-tabs pills card v-model="selectedTabIndex" @input="selectedTabIndex = $event">
        <b-tab title="Viewing" :head-html="'<i class=\'fas fa-eye\'></i>&nbsp;&nbsp;' + loc('tabs.viewing')">

          <div v-if="loaded.mainEntry">
            <Entry
              type="SINGLE"
              :entry="loaded.mainEntry"
              :globals="globals"
              class="entry"
              v-on:router="update($event)"
              @startEditing="startEditing($event)"></Entry>
          </div>

          <div v-if="loaded.pinnedEntries" class="pinned-area">
            <Entry
              type="ARRAY"
              v-for="(entryList, index) in loaded.pinnedEntries"
              :key="index"
              :entry="entryList"
              :globals="globals"
              pinned="true"
              class="entry"
              v-on:router="update($event)"
              @startEditing="startEditing($event)"></Entry>
          </div>

        </b-tab>
        <b-tab title="Editing" :head-html="'<i class=\'fas fa-wrench\'></i>&nbsp;&nbsp;' + loc('tabs.editing')" title-link-class="editing-tab-link">

          <div>
            <b-tabs v-model="currentEditorTabIndex">
              <b-tab v-for="(editEntry, index) in editing" :key="index" :title="editEntry.lexicon">
                <b-button-toolbar class="button-row">
                  <b-button-group size="sm" class="mx-1">
                    <b-btn class="btn btn-primary" @click="alertIt(currentEditorTabIndex)"><i class="far fa-file"></i>&nbsp;&nbsp;{{loc('editor.save')}}</b-btn>
                  </b-button-group>
                  <b-input-group size="sm">
                    <b-form-input placeholder="message"></b-form-input>
                  </b-input-group>
                  <b-button-group size="sm" class="mx-1">
                    <b-btn @click="alertIt()">Revert changes</b-btn>
                    <b-btn @click="alertIt()">Delete</b-btn>
                    <b-btn @click="alertIt()">Compare...</b-btn>
                    <b-btn @click="alertIt()">JSON</b-btn>
                    <b-btn @click="alertIt()">Close all saved</b-btn>
                  </b-button-group>
                  <b-button-group size="sm" class="mx-1">
                    <b-btn @click="">Preview</b-btn>
                  </b-button-group>
                </b-button-toolbar>
                <div>
                  <tree :definition="editEntry.structure" :model="editEntry.data" :globals="globals" :compare="diff" :path="''"></tree>
                </div>
              </b-tab>
              <!-- New Tab Button (Using tabs slot) -->
              <b-nav-item slot="tabs" @click.prevent="newTab" href="#">
                +
              </b-nav-item>
            </b-tabs>
          </div>

        </b-tab>
      </b-tabs>
    </b-card>

  </div>
</template>


<script>

import mix from '../mix'
import Entry from './Entry'
import TwoSides from './TwoSides'
import Tree from './Tree'
import RestResource from '../services/RestResource'
export default {
  mixins: [mix],
  name: 'Display',
  components: {
    TwoSides,
    Tree,
    Entry
  },
  data () {
    return {
      loaded: {
        entries: [],
        mainEntry: null,
        pinnedEntries: {}
      },
      editing: [],
      selectedTabIndex: 0,
      currentEditorTabIndex: 0,
      diff: []
    }
  },
  computed: {
    dynamicComponent :  function() {
      return {
        props: ["entry"],
        template: this.htmlStuff
      } 
    }
  },
  methods: {
    newTab: function () {
      this.newEntry('saldo')
    },
    newEntry: function (resID) {
      this.startEditing({"lexicon": resID, "data": this.augmentModel({_source: { lexiconName: resID }})})
    },
    startEditing: function (e) {
      console.log("startEditing", e)
      let template = {}
      let newEntry = {
        'lexicon': e.lexicon,
        'structure': this.globals.cold.lexicons[e.lexicon].structure,
        'data': e.data || template
      }
      this.editing.push(newEntry)
      this.selectedTabIndex = 1
    },
    alertIt: function(index) {
      alert(JSON.stringify(this.editing[this.currentEditorTabIndex].data))
    },
    generateDiff: function() {
      // TODO: Get from backend
      let diffObj = {diff:[{'after':'Apa', 'field' : 'FormRepresentations.partOfSpeech', 'type' : 'ADDED'}]}
      let diff = diffObj.diff
      for (let item in diff) {
        diff[item] = "." + diff[item].replace(/[^\]]./g, "[0].")
      }
      this.diff = diff
    },
    loadEntries: function() {

      const restResourceService = RestResource

      let query = 'extended||and|id|equals|' + this.globals.hot.entries.join("|")
      let http = restResourceService.sendRequest(null, query)
      let that = this
      http.then((response) => {
        that.loaded.mainEntry = response.data.hits.hits[0]
      }).catch((response) => {
        // error
        console.log("A search error occured", response)
        that.results = null
      })//.finally(() => {})

      /* const allEntries = this.globals.hot.entries.concat(this.globals.hot.pinned)
      let query = 'extended||and|id|equals|' + allEntries.join("|")
      let http = restResourceService.sendRequest(null, query)
      let that = this
      http.then((response) => {
        that.loaded.entries = response.data.hits.hits
        that.loaded.mainEntry = null
        that.loaded.pinnedEntries = {} // Lexicon-id:s are the keys
        for (let entry of that.loaded.entries) {
          entry.isFlipped = false
          if (_.includes(this.globals.hot.pinned, entry._id)) {
            if (! that.loaded.pinnedEntries[entry._source.lexiconName]) {
              that.$set(that.loaded.pinnedEntries, entry._source.lexiconName, [])
            }
            that.loaded.pinnedEntries[entry._source.lexiconName].push(entry)
          } else {
            that.loaded.mainEntry = entry
          }
        }
      }).catch((response) => {
        // error
        console.log("A search error occured", data)
        that.results = null
      }).finally(() => {}) */
    },
    loadPinned: function() {
      const restResourceService = RestResource

      let query = 'extended||and|id|equals|' + this.globals.hot.pinned.join("|")
      let http = restResourceService.sendRequest(null, query)
      let that = this
      http.then((response) => {
        that.loaded.pinnedEntries = {} // Lexicon-id:s are the keys
        for (let entry of response.data.hits.hits) {
          if (! that.loaded.pinnedEntries[entry._source.lexiconName]) {
            that.$set(that.loaded.pinnedEntries, entry._source.lexiconName, [])
          }
          that.loaded.pinnedEntries[entry._source.lexiconName].push(entry)
        }
      }).catch((response) => {
        // error
        console.log("A search error occured", response)
        //that.results = null
      })//.finally(() => {})
    }
  },
  watch: {
    'globals.hot.entries': function () {
      this.loadEntries()
    },
    'globals.hot.pinned': function () {
      this.loadPinned()
    }
  },
  created: function() {
    this.loadEntries()
  }
}
</script>

<style scoped>

  .pinned-area {
    margin-top: 20px;
  }
  .button-row {
    padding: 10px;
  }

</style>
