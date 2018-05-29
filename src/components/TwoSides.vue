<template>
  <div>
    <div class="containercard">
      <div id="card" class="card" ref="kvint">
        <div class="front">
          <slot name="front"></slot>
        </div>

        <div class="back">
          <slot name="back"></slot>
          test
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TwoSides',
  props: ['flipped'],
  data () { return {} },
  watch: {
    'flipped': function(newValue) {
      console.log("watched flipped")
      this.flip()
    }
  },
  methods: {
    flip: function() {
      this.$refs["kvint"].classList.toggle('flipped')
    }
  }
}
</script>

<style scoped>
  .containercard {
    width: 100%;
    position: relative;
    -webkit-perspective: 800px;
    -moz-perspective: 800px;
    -o-perspective: 800px;
    perspective: 800px;
  }

  .card {
    width: 100%;
    -webkit-transition: -webkit-transform 1s;
    -moz-transition: -moz-transform 1s;
    -o-transition: -o-transform 1s;
    transition: transform 1s;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -o-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform-origin: 50% 50%;
  }

  .card div {
    width: 100%;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .card .back {
    -webkit-transform: rotateY( 180deg );
    -moz-transform: rotateY( 180deg );
    -o-transform: rotateY( 180deg );
    transform: rotateY( 180deg );
  }

  .card.flipped {
    -webkit-transform: rotateY( 180deg );
    -moz-transform: rotateY( 180deg );
    -o-transform: rotateY( 180deg );
    transform: rotateY( 180deg );
    background: transparent;
  }

  .containercard .card.flipped .front {
    display: none;
  }

  .containercard .card:not(.flipped) .back {
    display: none;
  }
</style>
