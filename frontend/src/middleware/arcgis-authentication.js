import {
  GET_IDENTITY,
  SET_IDENTITY,
  LOAD_PORTAL,
} from '../constants/action-types'

<<<<<<< Updated upstream:frontend/src/middleware/arcgis-authentication.js

esriConfig.portalUrl = APP_PORTAL_URL;
const info = new OAuthInfo({ appId: APP_ID, popup: false, portalUrl: APP_PORTAL_URL })

IdentityManager.registerOAuthInfos([info])

=======
>>>>>>> Stashed changes:client/src/middleware/arcgis-authentication.js
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
    case GET_IDENTITY:
<<<<<<< Updated upstream:frontend/src/middleware/arcgis-authentication.js
      next(action)
      return IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
        .then((result) => { //console.log(result)
          store.dispatch({ type: LOAD_PORTAL })
        })

    case SIGN_IN:
      IdentityManager.getCredential(`${info.portalUrl}/sharing`)
      return next(action)

    case SIGN_OUT:
      IdentityManager.destroyCredentials()
      window.location.reload()
      return next(action)

    default:
      return next(action)
=======
        next(action)
        fetch('/refresh')
        .then(res => res.json()) //.json is asynch; .parse is sync
        .then(jsonRes => { //console.log(jsonRes)
            if(jsonRes.refresh){ store.dispatch({ type: LOAD_PORTAL })}
            else {
              store.dispatch({
                type: SET_IDENTITY,
                username: null,
                fullname: null,
                email: null,
                thumbnailurl: null,
              })
            }
        })

    default:
      return next(action)
>>>>>>> Stashed changes:client/src/middleware/arcgis-authentication.js
  }
}

export default arcgisMiddleWare