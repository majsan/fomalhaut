<template>
  <div>
    <div :class="{'added': added}">
      <!--{{path}}-->
      <div v-if="definition.label && !definition.properties" :class="{'deduced': definition.deduced}">{{loc(definition.label)}}</div>
      <!-- Leaf -->
      <div v-if="! definition.properties">
        <draggable :list="model" :options="{handle: '.drag-handle', ghostClass: 'ghost'}">
          <div v-for="item, index in model">
            <div v-if="editing !== index">
              <div class="drag-handle" v-if="model.length > 1" style="display:inline-block;color:lightblue"><i class="fas fa-circle"></i></div>
              <button class="btn btn-default" @click="removeLeaf(index)" :class="{'hidden' : definition.deduced}"><i class="fas fa-trash-alt"></i></button>
              <button class="btn btn-default" @click="editing = index" :class="{'hidden' : definition.deduced}"><i class="fas fa-pencil-alt"></i></button>&nbsp;
              <div class="view-area" @click="editing = index">{{item}}</div> <!-- should be preprocessed -->
            </div>
            <div v-if="editing === index">
              <TreeEditor :model="item" @closed="closedEditor($event, index)"></TreeEditor>
            </div>
          </div>
        </draggable>
        <div @click="addLeafTo(model, definition)" v-if="definition.quantity === '*'">
          <i class="fas fa-plus-circle"></i>
        </div>
      </div>
      <!-- Branch -->
      <div class="child" v-for="child, childName in definition.properties">
        <div v-if="child.properties">
          <draggable v-model="model[childName]" :options="{handle: '.drag-handle', ghostClass: 'ghost'}">
            <div v-for="item, index in model[childName]" class="branch">
            <div v-if="index === 0 && child.label" :class="{'deduced' : child.deduced}">{{loc(child.label)}}</div>
            <div class="trash-branch">
              <i class="fas fa-trash-alt"></i>
              <div class="drag-handle" v-if="model[childName].length > 1" style="display:inline-block;color:lightblue"><i class="fas fa-circle"></i></div>
            </div>
            <tree :definition="child" :model="item" :globals="globals" :compare="compare" :path="path + childName + '[' + index + ']'"></tree>
            <div v-if="index === model[childName].length - 1 && child.quantity === '*'" @click="addBranchTo(childName, child)">
              <i class="fas fa-plus-circle"></i>
            </div>
          </div>
          </draggable>
        </div>
        <div v-if="!child.properties">
          <tree :definition="child" :model="model[childName]" :globals="globals" :compare="compare" :path="path + '.' + childName"></tree>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import mix from '../mix'
import TreeEditor from './TreeEditor'
import Vue from 'vue'
import draggable from 'vuedraggable'
export default {
  props: ['definition', 'model', 'compare', 'path'],
  name: 'tree',
  mixins: [mix],
  components: {
    TreeEditor,
    draggable
  },
  data () {
    return {
      editing: Number.POSITIVE_INFINITY,
      added: false
    }
  },
  methods: {
    closedEditor: function(data, index) {
      this.model[index] = data
      this.editing = false
    },
    addBranchTo: function(fieldName, definition) {
      let emptyData = {}
      this.augmentBranch(definition, emptyData)
      this.model[fieldName].push(emptyData)
    },
    addLeafTo: function(model, definition) {
      model.push("test")
    },
    removeLeaf: function(index) {
      this.model.splice(index, 1)
      if (this.definition.quantity === '*') {
        
      } else {
        this.model.splice(index, 1, "") // later check the empty value/datatype in this.definition, maybe through a function in the mixin
      }
    }
  },
  watch: {
    'compare': function(newValue) {
      // Find out if there are additions or deletions on this level in the tree
      console.log("comparation found")
    }
  },
  created: function() {
    for (let change of this.compare) {
      if (change.type === 'ADDED') {
        if (change.field === this.path) {
          this.added = true
        }
      }
    }
  }
}
</script>

<style scoped>
  .child {
    margin-left: 20px;
  }
  .branch {
    border-top: 1px dotted gray;
    border-left: 1px dotted gray;
    padding-left: 4px;
    display: table;
  }
  .branch:first-child {
    border-top: none;
  }
  .branch:last-child {
    margin-bottom: 8px;
  }
  .view-area {
    display: inline-block;
  }
  .deduced {
    color: purple;
    font-style: italic;
  }
  .added {
    border-right: 5px solid lightgreen;
  }
  .trash-branch {
    
  }
  .hidden {
    color: purple;
    cursor: inherit;
  }
  .ghost {
    opacity: 0.4;
  }
  button {
    cursor: pointer;
  }
</style>
