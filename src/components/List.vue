<template>
  <div class="list-area">
    <div v-if="globals.hot.searching"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>
    <div v-if="results && results.hits">
      <b-pagination
        v-if="results.hits.total > globals.hot.hpp"
        size="sm"
        :per-page="25"
        :total-rows="results.hits.total"
        v-model="globals.hot.page"
        @change="changePage($event)">
      </b-pagination>
      <ul>
        <li
          v-for="hit in results.hits.hits"
          @click="toggleHit(hit._id)"
          :class="{open: isOpen(hit._id)}">{{pickLabel(hit)}}</li>
      </ul>
      <button
        disabled="true"
        class="btn btn-primary"
        v-if="results.hits.total > globals.hot.hpp"
        @click="saveAsCollection()">{{loc('hits.save_as_collection')}}</button>
    </div>
  </div>
</template>

<script>
import mix from '../mix'
export default {
  mixins: [mix],
  name: 'List',
  props: ['results', 'total'],
  data () {
    return {
      selectedItems: {},
      selectedIDs: {}
    }
  },
  methods: {
    isOpen: function(id) {
      return _.includes(this.selectedIDs, id)
    },
    toggleHit: function(id) {
      if (this.isOpen(id)) {
        this.closeHit(id)
      } else {
        this.openHit(id)
      }
      this.syncOpenedHits()
    },
    openHit: function(id) {
      this.selectedItems = {}
      this.selectedItems[id] = true
    },
    closeHit: function(id) {
      delete this.selectedItems[id]
    },
    syncOpenedHits: function() {
      let ids = _.keys(this.selectedItems)
      this.selectedIDs = ids
      this.update("show", ids.join("|"))
    },
    saveAsCollection: function() {
      this.$emit("collection", true)
    },
    changePage: function(newIndex) {
      this.$emit('router', [{param: "page", value: newIndex}])
    }
  }
}
</script>

<style scoped>
  .list-area {
    padding: 4px;
  }
  .open {
    font-weight: bold;
  }
  ul {
    list-style-type: none;
  }
  li {
    cursor: pointer;
  }
</style>
