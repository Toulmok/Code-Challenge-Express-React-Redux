import express from 'express'
import * as portal from '@esri/arcgis-rest-portal'

export const getUser = async (req, res) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) { 
    res.redirect("/")
    return
  } else {
    portal.getUser({username: req.session.arcgis.username, authentication: req.session.arcgis})
    .then( (user) => { //console.log(user.username) 
      res.json({
        username: user.username, 
        fullname: user.fullName, 
        email: user.email,
        thumbnail: user.thumbnail,
      })
    })
  }
}

export const getItems = async (req, res) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) { 
    res.redirect("/")
    return
  } else { //console.log(req.body)
    req.body.authentication = req.session.arcgis
    portal.searchItems(req.body)
    .then( (results) => res.json(results) )
  }
}

export const getTags = async (req, res) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) { 
    res.redirect("/")
    return
  } else { 
    portal.getUserTags({username: req.session.arcgis.username, authentication: req.session.arcgis})
    .then( (tags) => { //console.log(tags) 
      res.json(tags)
    })
  }
}

export const updateTags = async (req, res) => { //console.log(req.session.arcgis)
  if (!req.session.arcgis) { 
    res.redirect("/")
    return
  } else { //console.log(req.body)
    portal.updateItem({item: req.body, authentication: req.session.arcgis})
    .then( (results) => res.json(results) )
  }
}