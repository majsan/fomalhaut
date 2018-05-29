import axios from 'axios';
class RestResource {

  sendRequest(lexicons, query, page, hpp) {
    // Use vue-resource or any other http library to send your request
    console.log("sends a request")

    return new Promise(function(resolve, reject) {
      let url = window.settings.backend + '/query?q=' + query
      if (lexicons) {
        url += '&resource=' + lexicons.join(',')
      }
      if (! hpp) hpp = 25;
      if (page) {
        url += '&start=' + (page - 1) * hpp // The GUI is 1-based but backend 0-based
      }
      url += '&size=' + hpp

      if (query.indexOf('simple|') === 0) {
        url += '&highlight=true'
      }

      axios.get(url).then(response => {
        // success
        console.log("success.")
        resolve(response)
      }, response => {
        // error
        console.log("failure.")
        reject(response)
      })
    })
  }

  sendContextRequest(lexicon, centerID, query) {
    console.log("sendContextRequest", lexicon, centerID, query)
    let params = ['size=10']
    if (centerID) {
      params.push('center=#{centerID}')
    }
    if (query) {
      params.push('q=' + query)
    }
    let url = window.settings.backend + '/getcontext/' + lexicon
    if (params.length !== 0) {
      url += '?' + params.join("&")
    }
    return new Promise(function(resolve, reject) {
      axios.get(url).then(response => {
        // success
        console.log("success.")
        resolve(response)
      }, response => {
        // error
        console.log("failure.")
        reject(response)
      })
    })
  }

  tryLogin(username, password, keep) {
    // Use vue-resource or any other http library to send your request
    console.log("sends a request")

    if (keep) {
      // save to local storage (NOTE: The format is slightly defferent because of backwards compatibility with old karp)
      window.localStorage.setItem('karplogin', window.btoa(username) + ':' + window.btoa(password))
    } else {
      window.localStorage.removeItem('karplogin')
    }

    let userstring = window.btoa(username + ':' + password)

    axios.defaults.headers.common['Authorization'] = 'Basic ' + userstring

    return new Promise(function(resolve, reject) {
      let url = window.settings.backend + '/checkuser'

      axios.get(url).then(response => {
        // success
        console.log("success.", response)
        let data = response.data
        if (data.authenticated) {
          let openResources = []
          let openResourcesForRead = []
          for (let lexicon in data.permitted_resources.lexica) {
            let permData = data.permitted_resources.lexica[lexicon]
            if (permData.write) {
              openResources.push(lexicon)
            }
            if (permData.read) {
              openResourcesForRead.push(lexicon)
            }
          }
          resolve({
            ok: true,
            openResourcesForRead: openResourcesForRead,
            openResources: openResources,
            username: username
          })
        } else {
          resolve({ok: false})
        }
      }, response => {
        // error
        console.log("failure.")
        reject(response)
      })
    })
  }

  logout() {
    // Kill backend session:
    let url = window.settings.backend + '/logout'
    axios.get(url)
    delete axios.defaults.headers.common['Authorization']
  }

}

const singleton = new RestResource()
export default singleton