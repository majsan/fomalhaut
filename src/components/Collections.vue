<template>
  <div class="collections-area">
    <b-form-select v-model="selected" :options="options" class="mb-3">
    </b-form-select>
    <ul>
      <li v-for="item in pre" @click="toggleHit(item._id)">{{pickLabel(item)}}</li>
    </ul>
    <ul v-if="center">
      <li>{{pickLabel(center)}}</li>
    </ul>
    <ul>
      <li v-for="item in post" @click="toggleHit(item._id)">{{pickLabel(item)}}</li>
    </ul>
    <div v-for="monkey in globals.hot.savedCollections">APA</div>
  </div>
</template>

<script>
import mix from '../mix'
import RestResource from '../services/RestResource'
export default {
  mixins: [mix],
  name: 'Collections',
  props: [],
  data () {
    return {
      collections: [
        {
          query: "extended||and|sense|equals|hej..1",
          lexicon: "saldo",
          name: "Hej"
        }
      ],
      selected: null,
      pre: [],
      center: null,
      post: []
    }
  },
  computed: {
    options: function () {
      return [{value: null, text: "Select a collection"}].concat(_.map(this.globals.hot.savedCollections, function(item) {
        return {value: item.name, text: item.name, query: item.query, lexicons: item.lexicons}
      }))
    }
  },
  watch: {
    'selected': function(newValue) {
      if (newValue) {
        let collection = _.find(this.globals.hot.savedCollections, (c) => c.name === newValue)
        this.getContext(collection.lexicons, null, collection.query)
      }
    },
    'globals.hot.savedCollections': function () {
      console.log("globals.hot.savedCollections changed.")
      // denna watch behövs inte egentligen.
    }
  },
  methods: {
    getContext: function(lexicons, id, query) {
      console.log("Getting context.", lexicons, id, query)
      const restResourceService = RestResource
      // Always start with the external lexicons for performance reasons
      let http = restResourceService.sendContextRequest(lexicons[0], id, query)
      let that = this
      http.then((response) => {
        console.log("response.data", response.data)
        that.pre = response.data.pre
        that.center = response.data.center
        that.post = response.data.post
      }).catch((response) => {
        // error
        console.log("A search error occured", data)
        that.pre = []
        that.center = null
        that.post = []
      }).finally(() => {
        // ...
      })
    },
    toggleHit: function(id) {

    }
  }
}
</script>

<style scoped>
  
</style>
