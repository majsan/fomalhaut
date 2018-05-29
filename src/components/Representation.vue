<template>
  <div>
    <template v-if="isFunction">
      <div v-html="field.render(data)"></div>
    </template>
    <template v-else>
      {{processedData}}
    </template>
  </div>
</template>


<script>

export default {
  name: 'Representation',
  components: {
  },
  props: ['data', 'field'],
  data () {
    return {
      isFunction: false
    }
  },
  computed: {
    'processedData': function() {
      return this.data
    }
  },
  methods: {
    
  },
  watch: {

  },
  created: function() {
    console.log("CREATED", this.field, this.field.render)
    if (this.field.render && _.isFunction(this.field.render)) {
      this.isFunction = true
    }
  }
}

/*
  string (default)
  number
  grouped-number (will be thousands-separated and localized)
  boolean
  function() returning html

  saldo-link?
  lemgram-link?
*/
</script>

<style scoped>

</style>
