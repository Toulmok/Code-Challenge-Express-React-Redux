import dotenv from 'dotenv'
dotenv.config({path:'./server/.env'})
import express from 'express'
import { ArcGISIdentityManager } from '@esri/arcgis-rest-request'
import session from 'express-session'
import SessionFileStore from 'session-file-store'
const FileStore = SessionFileStore(session) // Create a new express and file store for our sessions
import { randomBytes } from 'crypto'
//import 'cross-fetch/dist/node-polyfill.js'
//import 'isomorphic-form-data'

const oauthOptions = {
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI
}
const port = parseInt(process.env.PORT)
// Determine how long we want our session to last we know refresh tokens last 2 weeks so we subtract an hour to provide some padding.
const sessionTTL = 60 * 60 * 24 * 7 * 2 - 60 * 60 * 1 // 2 weeks - 1 hours in seconds;

// Params for setting up the session middleware
export const sessionParams = {
  name: process.env.SESSION_COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: sessionTTL * 1000 }, // Set the max age on the cookie to match our session duration
  store: new FileStore({
    ttl: sessionTTL, // Session duration
    secret: process.env.ENCRYPTION_KEY,
    // define how to encode our session to text for storing in the file. We can use the `serialize()` method on the session for this.
    encoder: (sessionObj) => { //console.log({ sessionObj })
      sessionObj.arcgis = sessionObj.arcgis.serialize()
      return JSON.stringify(sessionObj)
    },
    // define how to turn the text from the session data back into an object. We can use the `ArcGISIdentityManager.deserialize()` method for this.
    decoder: (sessionContents) => { //console.log({ sessionContents })
      const sessionObj = JSON.parse(sessionContents)
      if (sessionObj.arcgis) {
        sessionObj.arcgis = ArcGISIdentityManager.deserialize(sessionObj.arcgis)
      }
      return sessionObj
    }
  })
}
// When a user visits the authorization page start the oAuth 2.0 process. The `ArcGISIdentityManager.authorize()` method will redirect the user to the authorization page.
export const authorize = (req, res, next) => { //console.log(res) //signIn
  // set a custom state value, this could be used to identify the user who started the request, here we just use a random string but this could be something like a user identifier. 
  oauthOptions.state = randomBytes(20).toString("hex")
  console.log("Starting OAuth Request ID:", oauthOptions.state)
  ArcGISIdentityManager.authorize(oauthOptions, res)
}
// After authorizing the user is redirected to /authenticate and we can finish the Oauth 2.0 process.
export const authenticate = async (req, res, next) => { //console.log(req.session)
  // Exchange the auth code for an instance of `ArcGISIdentityManager` save that to the session.
  if (req.query.code) {
    req.session.arcgis = await ArcGISIdentityManager.exchangeAuthorizationCode( oauthOptions, req.query.code )
  }
  // Once we have the session set redirect the user to the /app route so they can use the app.
  res.redirect("/")
}
// Sign the user out of our app by destroying the session the cookie and invalidating the session with ArcGIS
export const signOut = (req, res, next) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) {
    res.redirect("/")
    return
  }
  req.session.arcgis.signOut().then(() => {
    req.session.destroy(() => {
      res.clearCookie(process.env.SESSION_COOKIE_NAME)
      res.redirect("/")
    })
  })
}
// The refresh endpoint is used when the client needs to get a new token.
export const refresh = (req, res, next) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) { 
    res.send(JSON.stringify({refresh: false}))
  } else {
    // Refresh the session by getting a new access token with our refresh token
    req.session.arcgis.refreshCredentials()
    .then(() => res.send(JSON.stringify({refresh: true}) ))
  }
}