<template>
  <div class="left-column">
    <b-button-toolbar>
      <b-button-group size="sm">
        <b-btn
          :pressed="simpleSearch"
          @click="selectSearchType()"
          variant="outline-primary">{{loc('search.simple')}}</b-btn>
        <b-btn
          :pressed="extendedSearch"
          @click="selectSearchType()"
          variant="outline-primary">{{loc('search.extended')}}</b-btn>
      </b-button-group>
    </b-button-toolbar><br/>
    <b-input-group v-if="simpleSearch">
      <b-form-input
        class="simple-search"
        v-model="query" type="text"
        :placeholder="loc('search.enter_wordform')"
        v-on:keydown.native="handleKeydown($event)"></b-form-input>
      <b-button-group>
        <b-btn
          variant="primary"
          @click="performSearch(query)">{{loc('search')}}</b-btn>
      </b-button-group>
    </b-input-group>

    <b-modal lazy ref="addConstraintModal" @ok="handleOK">
      <b-input-group>
        <b-button-group>
          <!-- Logical Operator -->
          <b-dropdown :text="loc(humanize(modalLogicalOperator))">
            <b-dropdown-item @click="modalLogicalOperator='and'">{{loc('operator.and')}}</b-dropdown-item>
            <b-dropdown-item @click="modalLogicalOperator='not'">{{loc('operator.not')}}</b-dropdown-item>
          </b-dropdown>
          <!-- Keyword -->
          <b-dropdown :text="modalKeyword">
            <b-dropdown-item @click="modalKeyword=keyword.keyword" v-for="keyword in availableKeywords" :key="keyword.keyword">{{loc(keyword.label)}}</b-dropdown-item>
          </b-dropdown>
          <!-- Operator -->
          <b-dropdown :text="modalOperator">
            <b-dropdown-item @click="modalOperator=operator" v-for="operator, index in availableOperators" :key="index">{{operator}}</b-dropdown-item>
          </b-dropdown>
        </b-button-group>
        <!-- Value -->
        <b-form-input
          v-if="availableItems.length === 0"
          type="text"
          v-model="modalValue"></b-form-input>
        <b-dropdown
          v-if="availableItems.length > 0"
          :text="modalValue">
          <b-dropdown-item
            v-for="item of availableItems" :key="item.id"
            @click="modalValue=item.id">{{loc(item.t)}}</b-dropdown-item>
        </b-dropdown>
      </b-input-group>
    </b-modal>

    <div v-if="extendedSearch">
      <table>
        <tbody>
          <tr>
            <td></td><td><span>{{loc('search.find_entries_where')}}</span></td>
          </tr>
          <tr v-for="(constraint, index) in constraints">
            <td>
              <div class="trash" @click="removeConstraint(index)">
                <i class="fa fa-trash"></i>
              </div>
            </td>
            <td>
              <span @click="editConstraint(index)" class="constraint-string">
                <span v-if="index !== 0 && constraint.logicalOperator === 'and'">och där också </span>
                <span v-if="index !== 0 && constraint.logicalOperator === 'not'">utom där </span>
                <span>{{constraint.keyword}} {{constraint.operator}} {{constraint.value}}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <br/>
      <b-btn @click="openConstraintModal()">{{loc('search.add_constraint')}}</b-btn>
      <span
        class="to-hits-link"
        v-if="results && results.hits"
        @click="showHits()">&nbsp;&nbsp;<span class="badge badge-pill"
        :class="{'badge-success': results.hits.total !== 0, 'badge-secondary': results.hits.total === 0}">{{groupNumbers(results.hits.total)}}</span>&nbsp;<span v-if="results.hits.total !== 0">{{loc('search.show_hits')}}</span></span>
    </div>
  </div>
</template>

<script>
import mix from '../mix'
export default {
  mixins: [mix],
  name: 'Search',
  props: ['results'],
  created: function() {
    this.updateAvailable()
  },
  data () {
    return {
      query: '',
      simpleQuery: '',
      extendedQuery: '',
      simpleSearch: true,
      extendedSearch: false,
      availableKeywords: [],
      availableOperators: [],
      availableItems: [],
      constraints: [],
      modalLogicalOperator: 'and',
      modalKeyword: 'baseform',
      modalOperator: 'equals',
      modalValue: '',
      modalConstraintIndex : -1
    }
  },
  watch: {
    'modalKeyword': function(newValue) {
      let keyword = _.find(this.availableKeywords, (kw) => kw.keyword === newValue)
      this.availableOperators = keyword.op
      if (keyword.set) {
        this.availableItems = this.globals.cold.sets[keyword.set].values
      } else {
        this.availableItems = []
      }
    }
  },
  methods: {
    showHits: function() {
      this.update('tab', 'hits')
    },
    humanize: function(text) {
      /* takes a part of a query and returns the key for the human readable translation */
      let conversion = {
        'and': 'operator.and',
        'not': 'operator.not'
      }
      return conversion[text]
    },
    updateAvailable: function() {
      let currentLexicons = this.globals.cold.lexicons
      let keywords = []
      for (let lexiconID in currentLexicons) {
        keywords = _.concat(keywords, currentLexicons[lexiconID].keywords)
      }
      this.availableKeywords = keywords
      // TODO: Handle starting values
    },
    generateQuery: function() {
      this.extendedQuery = _.map(this.constraints, (c) => {
        return `${c.logicalOperator}|${c.keyword}|${c.operator}|${c.value}`
      }).join("||")
      this.query = this.extendedQuery
      this.update("query", "extended||" + this.query)
    },
    selectSearchType: function(type) {
      this.simpleSearch = ! this.simpleSearch // Toggle it
      this.extendedSearch = ! this.extendedSearch  // Toggle it
      if (this.simpleSearch) {
        this.query = this.simpleQuery
        this.update([{param: 'query', value: 'simple||' + this.query}, {param: 'show', value: ''}])
      } else {
        if (this.extendedQuery) {
          this.query = this.extendedQuery
          this.update([{param: 'query', value: 'extended||' + this.query}, {param: 'show', value: ''}])
        }
      }
    },
    openConstraintModal: function() {
      this.modalConstraintIndex = -1
      this.$refs.addConstraintModal.show()
    },
    addConstraint: function(constraint) {
      this.constraints.push(constraint)
      this.generateQuery()
    },
    removeConstraint: function(index) {
      this.constraints.splice(index, 1)
      this.generateQuery()
    },
    editConstraint: function(index) {
      this.modalConstraintIndex = index
      let c = this.constraints[index]
      this.modalLogicalOperator = c.logicalOperator
      this.modalKeyword = c.keyword
      this.modalOperator = c.operator
      this.modalValue = c.value
      this.$refs.addConstraintModal.show()
    },
    updateConstraint: function(index, constraint) {
      this.$set(this.constraints, index, constraint)
      this.generateQuery()
    },
    performSearch: function() {
      this.update([
        {param: 'page', value: '1', preventAction: true},
        {param: 'show', value: ''},
        {param: 'tab', value: 'hits'},
        {param: 'query', value: 'simple||' + this.query}
      ])
    },
    handleOK: function() {
      let constraint = {
        logicalOperator: this.modalLogicalOperator,
        keyword: this.modalKeyword,
        operator: this.modalOperator,
        value: this.modalValue
      }
      if (this.modalConstraintIndex === -1) {
        this.addConstraint(constraint)
      } else {
        this.updateConstraint(this.modalConstraintIndex, constraint)
      }
      
    },
    handleKeydown: function(event) {
      if (event.which === 13) {
        // Enter
        this.performSearch()
      }
    }
  }
}
</script>

<style scoped>
  .simple-search {
    width: 200px;
  }
  .left-column {
    padding-left: 4px;
  }
  .b-btn:focus {
    outline: none;
  }
  .trash {
    width: 18px;
  }
  .constraint-string {
    cursor: pointer;
  }
  .to-hits-link {
    cursor: pointer;
  }
</style>
