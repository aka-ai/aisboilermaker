import { Provider } from 'react-redux'
import store from './store/index'
import React from 'react'
import ReactDom  from 'react-dom'


const element = <h1>Hello, pretty!</h1>
ReactDom.render(
  <Provider store={store}>
    {/* rest of app goes here! */}
  </Provider>,
  document.getElementById('app')
)
