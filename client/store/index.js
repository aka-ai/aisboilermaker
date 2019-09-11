import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from './user'

const store = createStore(
  user,
  applyMiddleware(
    thunkMiddleware,
    createLogger()
  )
)

export default store