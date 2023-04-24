import { default as storeState } from '../store/store'
import {
  LOAD_PORTAL,
  SET_IDENTITY,
  GET_USER_ITEMS,
  SET_USER_ITEMS,
  GET_USER_TAGS,
  SET_USER_TAGS,
  ADD_ITEM_TAGS,
  DELETE_ITEM_TAGS,
} from '../constants/action-types'

const qParamArray = ['title','type','created','tag']
let tagsCsv = [] //: { id: string, tag: string, }[] = []
let tagsToUpdate = []
let xButton = undefined
let qString = ''

/**
 * Middleware function with the signature
 *
 * storeInstance =>
 * functionToCallWithAnActionThatWillSendItToTheNextMiddleware =>
 * actionThatDispatchWasCalledWith =>
 * valueToUseAsTheReturnValueOfTheDispatchCall
 *
 * Typically written as
 *
 * store => next => action => result
 */
const arcgisMiddleWare = store => next => (action) => {
  switch (action.type) {
    case LOAD_PORTAL:
      fetch('/getUser')
      .then(res => res.json()) //.json is asynch; .parse is sync
      .then((user) => { //console.log(user)
        store.dispatch({
          type: SET_IDENTITY,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          thumbnailurl: user.thumbnailurl,
      })})
      .then(() => store.dispatch({ type: GET_USER_ITEMS }) )
      .then(() => { store.dispatch({ type: GET_USER_TAGS }) })
      return next(action)

    case GET_USER_ITEMS:
      //Does this sanitize?
      let myUrlGet = new URL(window.location.href); //console.log(myUrlGet.toString())
      let myUrlHas = new URLSearchParams(myUrlGet.search)

      if(myUrlHas.has("dcreated")) {
        let qDCreated = myUrlHas.get("dcreated"); //console.log(qDCreated)
        if((qDCreated !== '')){
          let created = new Date(qDCreated)
          let createdUnix = created.getTime().toString()
          if(myUrlHas.get("rcreated")==="before") {
            createdUnix = '[0 TO ' + createdUnix + ']'
          } else if (myUrlHas.get("rcreated")==="after") {
            createdUnix = '[' + createdUnix + ' TO 99999999999999]'
          } //console.log(createdUnix)
          myUrlHas.set("created",createdUnix)
        }
      }

      myUrlGet.search = myUrlHas.toString()
      //const new_url = myUrlGet.toString(); console.log(new_url)
      window.history.replaceState('','',myUrlGet.search)

      qString = ''
      for (const field of qParamArray) {
        if(myUrlHas.has(field)) {
          if((myUrlGet.searchParams.get(field) !== '')){
            qString += ' AND ' + field + ':' + myUrlGet.searchParams.get(field)
          }
        }
      }

      if (storeState.getState().user.username === null) { //console.log("query string is " + qString)
        return next(action)
      } else { //portal.user.fetchItems() might be better
        try { 
          fetch('/getItems', {
            method: "POST",
            body: JSON.stringify({
              q: `owner:${storeState.getState().user.username}` + qString,
              sortField: 'modified',
              sortOrder: 'desc',
              num: 20, //max is 100, default is 10
              start: 1,
            }),
            headers: { "Content-Type": "application/json" },
          })
          .then(res => res.json()) //.json is asynch; .parse is sync
          .then(({ results }) => { //console.log(results)
            store.dispatch({ type: SET_USER_ITEMS, userItems: results, })
          })
        }
        catch(err) { console.log(err.message) }
        finally { console.log(storeState.getState().user.username + ' is getting items') }
      }
      return next(action)

    case GET_USER_TAGS:
      if (storeState.getState().user.username === null) {
        return next(action)
      } else {
        try { 
          return fetch('/getTags')
          .then(res => res.json()) //.json is asynch; .parse is sync
          .then( (tagsObj) => { //console.log(tagsObj.tags.map(({tag}) => tag) )
            store.dispatch({ type: SET_USER_TAGS, userTags: tagsObj.tags.map(({tag}) => tag) })
          })
        }
        catch(err) { console.log(err.message) }
        finally { console.log(storeState.getState().user.username + ' is fetching tags') }
      }
      return next(action)

    case ADD_ITEM_TAGS:
      next(action)
      tagsCsv = []
      tagsToUpdate = []

      document.querySelectorAll("input.inputTags").forEach(input => {
        if (input.value !== '') {
          tagsCsv.push({
            id: input.id.replace('input',''), //(option as HTMLInputElement) //removes first instance of word
            tag: input.value,
          })
        }
      }); //console.log(tagsCsv)
      document.querySelectorAll("select.selectTags option:checked").forEach(option => {
        if (option.id !== '') {
          tagsCsv.push({
            id: option.id.replace((option.value),''), //(option as HTMLInputElement) //removes first instance of word
            tag: option.value,
          })
        }
      }); //console.log(tagsCsv)

      tagsCsv.forEach((itemToUpdate) => { //__esri.PortalItemUpdateParams
        tagsToUpdate = storeState.getState().query.userItems.find(item => item.id === itemToUpdate.id).tags.sort()
        tagsToUpdate.push(itemToUpdate.tag)

        try{ //console.log(tagsToUpdate)
          fetch('/updateTags', {
            method: "POST",
            body: JSON.stringify({
                id: itemToUpdate.id,
                tags: tagsToUpdate,
            }),
            headers: { "Content-Type": "application/json" },
          })
          .then(() => window.location.reload())
        }
        catch(err) { console.log(err) }
        finally {console.log(storeState.getState().user.username + ' is adding tags')} 
      })
      break

    case DELETE_ITEM_TAGS:
      next(action)
      tagsCsv = []
      tagsToUpdate = []

      xButton = document.querySelector("button.deleteMe")
      if (xButton.value !== '') {
        tagsCsv.push({
          id: xButton.id.replace(('delete' + xButton.value),''), //(option as HTMLInputElement) //removes first instance of word
          tag: xButton.value,
        })
      } //console.log(tagsCsv[0])
  
      tagsToUpdate = storeState.getState().query.userItems.find(item => item.id === tagsCsv[0].id).tags.sort()
      tagsToUpdate = tagsToUpdate.filter(tag => tag !== tagsCsv[0].tag)
      
      try{ //console.log(tagsToUpdate)
        fetch('/updateTags', {
          method: "POST",
          body: JSON.stringify({
              id: tagsCsv[0].id,
              tags: tagsToUpdate,
          }),
          headers: { "Content-Type": "application/json" },
        })
        .then(() => window.location.reload())
      }
      catch(err) { console.log(err) }
      finally {console.log(storeState.getState().user.username + ' is deleting a tag')} 
      break

    default:
      return next(action)
  }
}

export default arcgisMiddleWare