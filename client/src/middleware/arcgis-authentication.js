import {
  GET_IDENTITY,
  SET_IDENTITY,
  LOAD_PORTAL,
} from '../constants/action-types'

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
  }
}

export default arcgisMiddleWare