/*
 * @Descripttion: 
 * @version: 
 * @Author: leifxie
 * @Date: 2020-07-29 18:32:05
 * @LastEditors: leifxie
 * @LastEditTime: 2020-07-30 10:59:34
 * @FilePath: \react-express-ggzp\180228_gzhipin-client\src\index.js
 */ 
/*
入口JS
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'

import './assets/css/index.less'

// import './test/socketio_test'

ReactDOM.render((
  // 1)Provider让所有组件都可以得到state数据
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route component={Main}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))