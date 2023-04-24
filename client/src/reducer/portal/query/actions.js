import * as types from '../../../constants/action-types'

export function getUserItems() {
  return {
    type: types.GET_USER_ITEMS,
  }
}

export function setUserItems(userItems) {
  return {
    type: types.SET_USER_ITEMS,
    userItems,
  }
}

export function getUserTags() {
  return {
    type: types.GET_USER_TAGS,
  }
}

export function setUserTags(userTags) {
  return {
    type: types.SET_USER_TAGS,
    userTags,
  }
}

export function addItemTags() {
  return {
    type: types.ADD_ITEM_TAGS,
  }
}

export function deleteItemTags() {
  return {
    type: types.DELETE_ITEM_TAGS,
  }
}