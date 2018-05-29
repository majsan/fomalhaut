<template>
  <div class="mode-area" v-if="globals.cold.modes">
    <div class="header-area">

      <div class="left-side">
        <a id="logo-link" @click="reload($event)">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" id="logo-svg" viewBox="-8 -8 144 96">
              <g>
                <path class="logo-line" d="M 128,68 A 64,64 0 0,0 0,68"></path>
                <path class="logo-line" d="M 0,4 A 64,64 0 0,0 128,4"></path>
              </g>
            </svg>
            <span id="karp-text">KARP</span>
          </div>
        </a>
        <!-- Mode chooser button-->
        <div
          v-if="showModeChooserLink()"
          class="mode-chooser-link"
          v-bind:class="{'mode-chooser-link-active': showModeChooserHeader}"
          v-on:click="openModeChooser()">
          <i class="fas fa-th-large"></i>&nbsp;Fler lexikon...
        </div>
      </div>

      <div class="right-side">
        <!-- Login -->

        <b-modal ref="loginModal" @ok="handleOK">
          <p id="login-error" v-if="modalError">Error when trying to log in.</p>
          Användarnamn: <b-form-input
            type="text"
            v-model="modalUsername"></b-form-input>

          Lösenord: <b-form-input
            type="password"
            v-model="modalPassword"></b-form-input>
          <b-form-checkbox disabled>Spara inloggningen</b-form-checkbox>

        </b-modal>

        <!-- Logos -->
        <a href="https://spraakbanken.gu.se" target="_blank"><img id="sb-logo" src="../assets/sb-logo.jpg"/></a>
        <!-- Login -->
        <b-btn v-if="globals.hot.username" class="btn-sm" id="logout-button" @click="logout()">{{loc('logout')}}&nbsp;{{globals.hot.username}}</b-btn>
        <b-btn v-if="! globals.hot.username" class="btn-sm" id="login-button" @click="login()">{{loc('login')}}</b-btn>
        <!-- Languages -->
        <div
          class="change-language">
          <b-dropdown right>
            <template slot="button-content">
              <i class="fas fa-language"></i>
            </template>
            <b-dropdown-item
              v-for="language of globals.cold.languages"
              :key="language.isoCode"
              v-on:click="changeLanguage(language.isoCode)">{{language.nativeName}}</b-dropdown-item>
          </b-dropdown>
        </div>
        <!-- About -->

        <b-modal ref="aboutModal" ok-only>
          Karp <span id="version-string">v. 2.0d5 of the frontend</span>
        </b-modal>

        <b-btn class="btn-sm" id="about-button" @click="about()">{{loc('about_karp')}}</b-btn>
      </div>

    </div>
    <b-collapse id="mode-collapse" v-model="showModeChooserHeader">
      <div class="available-modes">
        <div class="available-mode" v-for="mode of globals.cold.modes">
          <img
            v-if="mode.image"
            class="mode-background-image"
            :src="'/static/mode-images/' + mode.image"/>
          <div
            class="mode-choice-overlay"
            v-bind:class="['panel-' + mode.color]"
            v-on:click="changeMode(mode.id)">
            {{loc(mode.title)}}
          </div>
        </div>
      </div>
    </b-collapse>
    <b-collapse id="mode-collapse" v-model="showModeHeader">
      <div class="current-mode" v-if="globals.hot.mode && globals.cold.modes[globals.hot.mode]">
        <div class="current-mode-image-area">
          <img
            v-if="globals.cold.modes[globals.hot.mode] && globals.cold.modes[globals.hot.mode].image"
            :src="'/static/mode-images/' + globals.cold.modes[globals.hot.mode].image"/>
        </div>
        <div class="current-mode-info-area">
          <h2>{{loc(globals.cold.modes[globals.hot.mode].title)}}</h2>
          <localized-html :globals="globals" :text="globals.cold.modes[globals.hot.mode].infoHTML"></localized-html>

          <div class="choose-lexicons-area" v-if="globals.cold.modes[globals.hot.mode] && globals.cold.modes[globals.hot.mode].lexicons && globals.cold.modes[globals.hot.mode].lexicons.length !== 1">
            <b-form-checkbox-group name="lexicons-checkboxes" v-model="selectedLexicons">
              <template v-for="lexiconID of globals.cold.modes[globals.hot.mode].lexicons">
                <b-form-checkbox :value="lexiconID" v-if="globals.cold.lexicons[lexiconID]">
                  {{loc(globals.cold.lexicons[lexiconID].name)}}
                </b-form-checkbox>
                <b-form-checkbox v-else disabled> <!-- When the lexicon defition for the lexiconID is missing -->
                  {{lexiconID}}
                </b-form-checkbox>
              </template>
            </b-form-checkbox-group>
          </div>

        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import RestResource from '../services/RestResource'
import mix from '../mix'
import LocalizedHtml from './LocalizedHtml'

export default {
  mixins: [mix],
  name: 'ModeChooser',
  components: {
    LocalizedHtml
  },
  watch: {
    'globals.hot.mode': function(newValue) {
      this.showModeHeader = (newValue !== 'DEFAULT')
    },
    'selectedLexicons' : function(newValue) {
      if (this.selectedLexiconsInitiated) { // Prevent this to run on init
        console.log("selectedLexicons", newValue);
        if (!_.isArray(newValue)) newValue = [newValue];
        //this.update('resources', newValue.join(","))
        this.update([
          {param: 'resources', value: newValue.join(',')},
          {param: 'page', value: '1', preventAction: true},
          {param: 'show', value: ''}
        ])
      }
      this.selectedLexiconsInitiated = true
    }
  },
  data () {
    return {
      showModeHeader: this.globals.hot.mode !== 'DEFAULT',
      showModeChooserHeader: false,
      selectedLexicons: [],
      selectedLexiconsInitiated: false,
      modalUsername: null,
      modalPassword: null,
      modalError: false
    }
  },
  methods: {
    reload: function(e) {
      e.preventDefault()
      window.location.href = window.location.pathname
    },
    login: function() {
      this.$refs.loginModal.show()
    },
    logout: function() {
      RestResource.logout()
      this.globals.hot.username = null
    },
    about: function() {
      this.$refs.aboutModal.show()
    },
    handleOK: function() {
      let http = RestResource.tryLogin(this.modalUsername, this.modalPassword, false)
      let that = this
      http.then((response) => {
        console.log("login response", response)
        if (response.ok) {
          this.globals.hot.username = response.username
        } else {
          this.modalError = true
          this.login()
        }
      }).catch((response) => {
        // error
        console.log("A login error occured", response)
      }).finally(() => {
        console.log("running")
      })
    },
    changeMode: function(modeID) {
      this.update([
        {param: "mode", value: modeID},
        {param: "query", value: "simple||"},
        {param: "show", value: ""}
      ])
      this.showModeChooserHeader = false
      this.showModeHeader = true
    },
    openModeChooser: function() {
      this.showModeChooserHeader = true
      this.showModeHeader = false
    },
    changeLanguage: function(isoCode) {
      this.update("lang", isoCode)
    },
    showModeChooserLink: function() {
      return _.size(this.globals.cold.modes) > 1
    }
  },
  created: function() {
    this.selectedLexicons = _.clone(this.globals.hot.lexicons)
    if (this.globals.cold.modes.length === 1) {
      this.showModeChooserHeader = false
      this.showModeHeader = true
    }
  }
}
</script>

<style scoped>

  .header-area {
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content: space-between;
  }

  #about-button {
    height: 38px;
    margin-left: 4px;
  }
  #version-string {
    font-size: x-small;
    color: gray;
  }
  #login-button {
    height: 38px;
    margin-left: 4px;
  }
  #logout-button {
    height: 38px;
    margin-left: 4px;
  }
  #login-error {
    color: red;
  }

  #logo-svg {
    height: 4ex;
    margin-top: 6px;
    margin-bottom: 2px;
    margin-left: 10px;
  }

  svg .logo-line {
    stroke: #428bca;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 8;
    fill: none;
  }

  #karp-text {
    font-weight: bold;
    vertical-align: super;
    font-size: large;
    color: #428bca;
  }

  #logo-link {
    text-decoration: none;
    cursor: pointer;
  }

  .left-side {
    display: flex;
  }

  .right-side {
    display: flex;
  }


  .change-language {
    margin-left: 4px;
  }


  /* Mode area */

  .mode-chooser-link {
    font-size: large;
    cursor: pointer;
    border-radius: 4px;
    display: table;
    padding: 4px;
    margin-left: 4px;
    margin-bottom: 4px;
    background-color: white;
  }

  .mode-chooser-link-active {
  }

  .mode-area {
    padding: 4px;
    margin-bottom: 4px;
  }

  #sb-logo {
    height: 32px;
    margin: 4px;
  }

  .available-modes {
    display: flex;
    flex-wrap: wrap;  }

  .available-mode {
    width: 50%;
    height: 120px;
  }
  .mode-background-image {
    height: 118px;
    position: absolute;
    z-index: -1;
  }
  .mode-choice-overlay {
    padding: 10px;
    text-align: center;
    color: white;
    cursor: pointer;
    height: 120px;
  }

  .current-mode {
    display: flex;
    padding: 10px;
  }
  .current-mode-image-area {
    width: 320;
    height: 280;
  }

  .choose-lexicons-area {
    margin-top: 12px;
  }

  .panel-black {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(80,80,80,0.7), rgba(40,40,40,0.7));
  }
  .panel-black:hover {
    background: linear-gradient(rgba(100,100,100,0.7), rgba(60,60,60,0.7));
  }

  .panel-yellow {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(80,80,0,0.7), rgba(40,40,0,0.7));
  }
  .panel-yellow:hover {
    background: linear-gradient(rgba(100,100,20,0.7), rgba(60,60,20,0.7));
  }

  .panel-purple {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(80,0,80,0.7), rgba(40,0,40,0.7));
  }
  .panel-purple:hover {
    background: linear-gradient(rgba(100,20,100,0.7), rgba(60,20,60,0.7));
  }

  .panel-red {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(80,0,0,0.7), rgba(40,0,0,0.7));
  }
  .panel-red:hover {
    background: linear-gradient(rgba(100,20,20,0.7), rgba(60,20,20,0.7));
  }

  .panel-turqoise {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(0,80,80,0.7), rgba(0,40,40,0.7));
  }
  .panel-turqoise:hover {
    background: linear-gradient(rgba(20,100,100,0.7), rgba(20,60,60,0.7));
  }

  .panel-green {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(0,80,0,0.7), rgba(0,40,0,0.7));
  }
  .panel-green:hover {
    background: linear-gradient(rgba(20,100,20,0.7), rgba(20,60,20,0.7));
  }

  .panel-blue {
    border: 1 ps solid gray;
    background: linear-gradient(rgba(0,0,80,0.7), rgba(0,0,0,0.7));
  }
  .panel-blue:hover {
    background: linear-gradient(rgba(20,20,100,0.7), rgba(20,20,60,0.7));
  }
</style>
