<template>
  <div>
    <div class="controls">
      <b-dropdown variant="link" boundary='window' no-caret>
        <template slot="button-content">
          <div class="entry-button"><i class="fas fa-cog"></i></div>
        </template>
        <b-dropdown-item @click="togglePin()">
          <span v-if="!pinned">Pin</span>
          <span v-if="pinned">Unpin</span>
        </b-dropdown-item>
        <b-dropdown-item disabled>Info</b-dropdown-item>
      </b-dropdown>
      <div class="entry-button" @click="edit()"><i class="fas fa-pencil-alt"></i></div>
      <!--<div class="entry-button edit-button" @click="edit(entryItem)">
        <i class="fa fa-pencil-alt"></i>
      </div>
      <div class="entry-button pin-button" v-if="!pinned" @click="loading=true;pin(entryItem)">
        <div v-if="!loading"><i class="fas fa-thumbtack"></i></div>
        <div v-if="loading"><i class="fas fa-spinner fa-pulse"></i></div>
      </div>
      <div class="entry-button flip-button" @click="flip()">
        <i class="fas fa-file-alt"></i>
      </div>-->
    </div>
  </div>
</template>


<script>

import mix from '../mix'

export default {
  mixins: [mix],
  name: 'Console',
  components: {},
  props: ['entry', 'pinned'],
  data () {
    return {

    }
  },
  methods: {
    'edit': function() {
      this.$emit('edit')
    },
    'togglePin': function() {
      this.$emit('toggle-pin')
    },
    'flip': function() {
      this.$emit('flip')
    }
  },
  watch: {},
  created: function() {

  }
}
</script>

<style scoped>
  .controls {
    display: inline-flex;
  }
  .entry-button {
    width: 24px;
    height: 24px;
    border: 1px solid lightgray;
    float: left;
    margin-right: 2px;
    text-align: center;
    cursor: pointer;
    color: #007bff;
  }
</style>
