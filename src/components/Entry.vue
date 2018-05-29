<template>
  <div class="entry-container" :class="{pinned: pinned}">
  <!--<TwoSides class="containercard" :flipped="mainEntry.isFlipped">
    <div slot="front" :class="{pinned: pinned}" class="front-area">-->
      <div class="front-header">
        <div class="result-header">
          <div v-if="pinned" class="pin-header">
            <img src="../assets/thumbtack.svg" class="pin-image"/><br/>
          </div>
          <div class="lexicon-header">{{loc(globals.cold.lexicons[lexiconName].name)}}</div>
        </div>
      </div>

      <!--      BY TEMPLATE      -->

      <div class="template-area" v-if="globals.cold.lexicons[lexiconName].template">
        <console :entry="entryData" @toggle-pin="togglePin(entryData)" :pinned="pinned" @flip="flip()" @edit="edit(entryData)"></console>
        <component :is="dynamicComponent" :entry="entryData"></component>
      </div>

      <!--     TABULAR VIEW      -->

      <div class="entry-area" v-else-if="globals.cold.lexicons[lexiconName].view === 'TABULAR'">
        <!-- A separate collection of tables for each entry -->

        <div v-for="entryItem of entries">
          <console :entry="entryItem" @toggle-pin="togglePin(entryItem)" :pinned="pinned" @flip="flip()" @edit="edit(entryItem)"></console>

          <div class="clear"></div>

          <template v-for="table of globals.cold.lexicons[lexiconName].asTables">
            <h4>{{loc(table.node.label || '')}}</h4>
            <table>
              <thead>
                <template v-for="(header, index) in table.children[0].children">
                  <th>
                    {{loc(header.node.label || '')}}
                  </th>
                </template>
              </thead>
              <tbody>
                <template v-for="row of table.children"> <!-- always 1 item if noRows=true -->
                  <tr v-for="dataRow in getRealRows(entryItem, table.node, row.node)">
                    <template v-for="(column, index) in row.children">
                      <td>
                      <!--<div
                        v-bind:class="{clickable: column.node.search, highlight: shouldHighlight(entryItem, column.node)}"
                        @click="clickedCell(entryItem._source, column.node)"
                        v-html="view(entryItem._source, column.node.path)"></div>-->
                      <!--<div
                        v-bind:class="{clickable: column.node.search, highlight: shouldHighlight(entryItem, column.node)}"
                        @click="clickedCell(entryItem._source, column.node)"
                        v-html="viewRelative(dataRow, column.node.path, table.node.path)"></div>-->
                        <div
                          v-bind:class="{clickable: column.node.search, highlight: shouldHighlight(entryItem, column.node)}">
                          <template v-if="isArrayRelative(entryItem._source, column.node.path, table.node.path)">
                            <div v-for="(item, index) of viewRelative(entryItem._source, column.node.path, table.node.path)" @click="clickedCell(entryItem._source, column.node, index)">
                              <Representation :data="item" :field="column.node"></Representation>
                            </div>
                          </template>
                          <template v-else>
                            <div @click="clickedCell(entryItem._source, column.node)">
                              <Representation :data="viewRelative(entryItem._source, column.node.path, table.node.path)" :field="column.node"></Representation>
                            </div>
                          </template>
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>

        </div>

      </div>

      <!--      MERGED SINGLE TABLE VIEW      -->

      <div class="entry-area" v-else-if="globals.cold.lexicons[lexiconName].view === 'COLUMNS'">
        <!-- iterate through all columns. A row equals one entry. -->
        <b-tabs pills v-if="globals.cold.lexicons[lexiconName].tabs">
          <template slot="tabs">
            <b-nav-item class="btn-sm" @click="currentTab = index" :active="currentTab === index" v-for="(tab, index) in globals.cold.lexicons[lexiconName].tabs" :key="index">{{loc(tab)}}</b-nav-item>
          </template>
        </b-tabs>
        <table>
          <thead>
            <th>

            </th>
            <template v-for="(header, index) in globals.cold.lexicons[lexiconName].byColumn">
              <th v-if="!hideColumn[index] && (header.tab === undefined || header.tab === null || header.tab === currentTab)">
                {{loc(header.label || '')}}
              </th>
            </template>
          </thead>
          <tbody>
            <tr v-for="entryItem of entries">
              <td>
                <console :entry="entryItem" @toggle-pin="togglePin(entryItem)" :pinned="pinned" @flip="flip()" @edit="edit(entryItem)"></console>
              </td>
              <template v-for="(column, index) in globals.cold.lexicons[lexiconName].byColumn" >
                <td v-if="!hideColumn[index] && (column.tab === undefined || column.tab === null || column.tab === currentTab)" :key="index">
                    <div
                      v-bind:class="{clickable: column.search, highlight: shouldHighlight(entryItem, column)}">
                      <template v-if="isArray(entryItem._source, column.path)">
                        <div v-for="(item, index) of view(entryItem._source, column.path)" @click="clickedCell(entryItem._source, column, index)">
                          <Representation
                            v-if="!column.ellipsis || index < column.ellipsis || isExpanded(column.path)"
                            :data="item"
                            :field="column"></Representation>
                          <span
                            v-if="column.ellipsis && index === column.ellipsis && !isExpanded(column.path)"
                            class="expand-link"
                            @click="expand(column.path)">more</span>
                        </div>
                        <span
                          v-if="column.ellipsis && isExpanded(column.path)"
                          class="minimize-link"
                          @click="minimize(column.path)">less</span>
                      </template>
                      <template v-else>
                        <div @click="clickedCell(entryItem._source, column)">
                          <Representation :data="view(entryItem._source, column.path)" :field="column"></Representation>
                        </div>
                      </template>
                    </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <!--<div slot="back" @click="flip()">
      <div>
      {{entry}}
      </div>
    </div>
  </TwoSides>-->
  </div>
</template>


<script>

import mix from '../mix'
import Console from './Console'
import Representation from './Representation'
export default {
  mixins: [mix],
  name: 'Entry',
  props: ['entry', 'type', 'pinned'],
  components: {
    Console,
    Representation
  },
  data () {
    return {
      localModel: {},
      htmlStuff: "<div class='error'>–template not loaded–</div>",
      entryData: {},
      mainEntry: null,
      lexiconName: null,
      entries: [],
      loading: false,
      currentTab: 0,
      expanded: [],
      hideColumn: []
    }
  },
  watch: {
    'entry' : function(newValue) {
      this.initiate()
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
    isExpanded: function(path) {
      return this.expanded.indexOf(path) !== -1
    },
    expand: function(path) {
      this.expanded.push(path)
    },
    minimize: function(path) {
      this.expanded = _.filter(this.expanded, (o) => o !== path)
    },
    getRealRows: function(entryItem, table, row) {
      if (table.noRow) {
        // No row level so we work with the table data directly
        let tableData = this.pick(entryItem._source, table.path, true)
        if (! _.isArray(tableData)) tableData = [tableData]
        console.log("TABLEDATA", tableData)
        return tableData
      } else {
        // Use the rows provided
        let rowData = this.pick(entryItem, row.path)
        if (_.isArray(rowData)) {
          return rowData
        } else {
          return [rowData]
        }
      }
    },
    shouldHighlight: function(entryItem, column) {
      if (_.size(this.globals.cold.highlightMap) > 0 ) {
        // Simple search, where the highlight comes from the backend
        let h = this.globals.cold.highlightMap[entryItem._id]
        if (h) {
          let shortenedPath = column.path.substr(1)
          return h[shortenedPath]
        }
      } else {
        // Extended search, where we highlight the concerned field
        let q = this.globals.hot.query
        let andClauses = _.drop(q.split('||'))
        let searchFields = _.map(andClauses, (clause) => clause.split('|')[1])
        return (! this.pinned) && searchFields.indexOf(column.search) !== -1
      }
    },
    flip: function() {
      this.mainEntry.isFlipped = ! this.mainEntry.isFlipped
      this.$forceUpdate()
    },
    alertIt: function() {
      alert(JSON.stringify(this.localModel))
    },
    edit: function(entry) {
      this.$emit('startEditing', {'lexicon' : entry._source.lexiconName, 'data' : this.augmentModel(entry)})
    },
    togglePin: function(entry) {
      if (this.pinned) {
        this.update('pinned', _.filter(this.globals.hot.pinned, (p) => p !== entry._id).join('|'))
      } else {
        const newPinned = this.globals.hot.pinned
        const newShow = []
        if (! _.find(newPinned, entry._id)) {
          newPinned.push(entry._id)
        }
        this.update([
          {
            param: "show",
            value: newShow.join('|')
          }, {
            param: "pinned",
            value: newPinned.join('|')
          }
        ])
      }
      
    },
    augmentModel: function(entry) {

      let copy = _.cloneDeep(entry._source) // We keep any unexpected data unaltered
      let struct = this.globals.cold.lexicons[entry._source.lexiconName].structure
      this.augmentBranch(struct, copy)
      return copy
    },
    initiate: function() {
      this.expanded = []
      if (this.type === 'SINGLE') {
        // Only one entry
        this.mainEntry = this.entry
        this.entries = [this.entry]
        //if (lexDef.template) { // TODO: Fix, doesn't work now
        //  this.htmlStuff = lexDef.template
        //  let data = this.entry._source
        //  if (lexDef.preprocess) {
        //    data = lexDef.preprocess(data)
        //  }
        //  this.entryData = data
        //}
      } else if (this.type === 'ARRAY') {
        this.mainEntry = this.entry[0]
        this.entries = this.entry
      }

      this.lexiconName = this.mainEntry._source.lexiconName
      //let lexDef = this.globals.cold.lexicons[this.lexiconName]

      this.examineAndHideUnusedColumns()
    },
    examineAndHideUnusedColumns: function() {
      if (this.globals.cold.lexicons[this.lexiconName].byColumn) {
        let hideList = []
        for (let i = 0; i < this.globals.cold.lexicons[this.lexiconName].byColumn.length; i++) {
          let column = this.globals.cold.lexicons[this.lexiconName].byColumn[i]
          let hasData = false
          if (column.showEmptyColumn) {
            continue
          }
          for (let entry of this.entries) {
            let data = this.view(entry._source, column.path)
            if (data.length !== 0) {
              hasData = true
            } else {
              console.log("EMPTY")
            }
          }
          if (!hasData) {
            hideList[i] = true
          }
        }
        this.hideColumn = hideList
        console.log("this.hideColumn", this.hideColumn)
      }
    },
    isArray: function(data, path) {
      return _.isArray(this.view(data, path))
    },
    isArrayRelative: function(data, path, currentLevel) {
      return _.isArray(this.viewRelative(data, path, currentLevel))
    },
    view: function(data, path) {
      let relevantData = this.pick(data, path, true)
      return relevantData
    },
    viewRelative: function(data, path, currentLevel) {
      let newPath = path.replace(currentLevel, '')
      return this.view(data, newPath)
    },
    clickedCell: function(data, config, index) {
      console.log("clicked cell", data, config, index)
      if (config.search) {
        let fieldData
        if (index !== undefined && index !== null) {
          fieldData = this.pick(data, config.path, true)
          fieldData = fieldData[index]
        } else {
          fieldData = this.pick(data, config.path)
        }
        this.update([
          {param: 'query', value: 'extended||and|' + config.search + '|equals|' + fieldData},
          {param: 'page', value: '1', preventAction: true},
          {param: 'tab', value: 'hits'}
        ])
      }
    }
  },
  created: function() {
    
    this.initiate()
    
  }
}
</script>

<style scoped>

  .entry-container {
    clear: both;
    border: 1px solid lightgray;
    display: table;
    padding: 4px;
    margin-bottom: 8px;
    border-radius: 6px;
  }
  .result-header {
    width: 100%;
  }
  .pin-header {
    width: 100%;
    text-align: center;
  }

  .lexicon-header {
    font-weight: bold;
    font-size: medium;
    font-variant: all-small-caps;
    text-decoration: underline;
    margin-bottom: 8px;
  }
  .pinned .lexicon-header {
    margin-top: -40px;
  }

  .expand-link {
    font-weight: bold;
    color: #007bff;
  }
  .minimize-link {
    font-weight: bold;
    color: #007bff;
  }

  h4 {
    text-transform: uppercase;
    font-size: small;
    font-weight: bold;
  }

  .clear {
    clear: both;
  }

  .front-area {
    padding: 4px;
  }
  .front-header {
    display: flex;
    justify-content: space-between;
  }

  .pin-image {
    margin-top: -10px;
    width: 60px;
  }

  .entry-button {
    display: inline;
    float: left;
    width: unset !important;
    cursor: pointer;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    padding: 6px;
    width: 80px !important;
    height: 32px;
    border: 1px solid gray;
    margin-bottom: 20px;
    text-align: center;
  }

  .clickable {
    cursor: pointer;
  }

  .pinned {
    /* background: linear-gradient(rgba(255, 230, 230, 1.0), rgba(255, 255, 255, 1.0)); */
  }

  .entry-area {
    float: left;
    width: unset !important;
  }

  table {
    margin-bottom: 20px;
  }
  th {
    padding: 4px;
    font-size: x-small;
    text-transform: uppercase;
  }
  tr {
    border-bottom: 2px solid #aaa;
  }
  tbody tr:last-child {
    border-bottom: none;
  }
  td {
    padding: 4px;
    vertical-align: top;
  }

  .error {
    color: red;
  }

  .highlight {
    background: yellow;
  }
</style>
