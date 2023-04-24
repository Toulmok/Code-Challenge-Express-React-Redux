import express, { json, static as Static } from "express"
import session from 'express-session'
import { join } from "path"
import { default as auth } from '../routes/auth.js'
import { default as portal } from '../routes/portal.js'
import { sessionParams } from '../controllers/auth.js'

//https://codingbeautydev.com/blog/javascript-dirname-is-not-defined-in-es-module-scope/
import fileDirName from './file-dir-name.js'
const { __dirname, __filename } = fileDirName(import.meta)

class Server {
  constructor() {
    this.app = express()
    this.port = parseInt(process.env.PORT)
    this.paths = {
      auth: '',
      portal: '',
    }
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.set("etag", false) // disable caching for demo
    this.app.use(json())
    this.app.use(session(sessionParams))
    this.app.use( // Pick up React index.html file
      Static(join(__dirname, "../client/build")) //after building client using 'npm run build' in client directory; proxy is dev only
    )
  }

  // Bind controllers to routes
  routes() {
    this.app.use(this.paths.auth, auth)
    this.app.use(this.paths.portal, portal)
    this.app.get("*", (req, res) => { // Catch all requests that don't match any route
      res.sendFile( join(__dirname, "../client/build/index.html"))
    })
  }

  listen() {
    this.app.listen(this.port, () => { console.log(`Server running at http://localhost:${this.port}`) })
  }
}

export default Server

/*
const corsOptions = {
  origin: 'http://localhost:9000',
  methods: ['GET','HEAD','POST','OPTIONS'],
  header: ['Origin','X-Requested-With','Content-Type','Accept'],
  preflightContinue: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

this.app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:9000") // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})*/