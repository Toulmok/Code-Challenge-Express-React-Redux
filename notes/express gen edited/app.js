/*
//https://www.youtube.com/watch?v=f3kfswbNf9Y
import 'cross-fetch/dist/node-polyfill.js'
import 'abort-controller/dist/polyfill.js'
import config from '@arcgis/core/config.js'
config.request.useIdentity = false //prevents identity-manager from loading
*/
//import bodyParser from 'body-parser'
//import dotenv from 'dotenv'
import createError from 'http-errors'
import express, { json, urlencoded, static as Static } from 'express'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import homepageRouter from './routes/homepage.js'

//https://codingbeautydev.com/blog/javascript-dirname-is-not-defined-in-es-module-scope/
import fileDirName from './file-dir-name.js'
const { __dirname, __filename } = fileDirName(import.meta)

var app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(Static(join(__dirname, 'public')))

app.use('/', homepageRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})

export default app