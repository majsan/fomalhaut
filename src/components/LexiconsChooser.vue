<template>
  <div class="lexicons-area">
    <b>On the server</b>
    <b-form-checkbox-group stacked v-model="selected" :options="options">
    </b-form-checkbox-group>
    <b>Locally</b>
    <b-form-checkbox-group stacked v-model="selectedLocally" :options="optionsLocally">
    </b-form-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'LexiconsChooser',
  props: ['lexicons'],
  watch: {
    'selected': function() {
      console.log("lexicon change", this.selected)
      this.changeLexicons()
    },
    'selectedLocally': function() {
      this.changeLexicons()
    }
  },
  data () {
    return {
      options: [{text: 'Saldo', value: 'saldo'}, {text: 'Kelly', value: 'kelly'}],
      optionsLocally: [{text: 'Saldo [fragment]', value: 'saldo-fragment'}, {text: 'SBLOL', value: 'sblol'}],
      selected: [],
      selectedLocally: []
    }
  },
  methods: {
    changeLexicons: function() {
      this.$emit('router', [{param: "lexicons", value: this.selected.join('|') + "||" + this.selectedLocally.join("|")}])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .lexicons-area {
    padding: 4px;
    margin-bottom: 4px;
  }
</style>
