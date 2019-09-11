import {Provider} from 'react-redux'
import store from './store/index'
import React from 'react'
import ReactDom from 'react-dom'
import '../public/style.css'

const element = <h1>hi</h1>

ReactDom.render(
  <Provider store={store}>hi</Provider>,
  document.getElementById('app')
)
