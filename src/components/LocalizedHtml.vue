<template>
  <div v-html="htmlForLanguage()"></div>
</template>

<script>
import mix from '../mix'

export default {
  mixins: [mix],
  name: 'LocalizedHtml',
  props: ['text'],
  data () {
    return {
      
    }
  },
  methods: {
    htmlForLanguage: function() {
      return this.loc(this.text)
    }
  }
}
</script>

<style scoped>

</style>
