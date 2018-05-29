<template>
  <div class="edit-area" v-on-clickaway="away">
    <input type="text" v-model="internalModel" v-autofocus/>
  </div>
</template>


<script>

import mix from '../mix'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [mix, clickaway],
  name: 'TreeEditor',
  components: {},
  props: ['model'],
  data () {
    return {

    }
  },
  methods: {
    away: function() {
      console.log("clicked away")
      this.$emit('closed', this.internalModel)
    }
  },
  watch: {},
  created: function() {
    this.internalModel = _.cloneDeep(this.model)
  }
}
</script>

<style scoped>
  .edit-area {
    display: table;
  }
</style>
