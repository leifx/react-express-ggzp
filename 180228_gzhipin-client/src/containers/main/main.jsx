/*
主体界面的容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import {getUser} from '../../redux/actions'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

import {getRedirectPath} from '../../utils'

class Main extends Component {


  navList = [
    {
      path: '/laoban', // 路由路径
      component: Laoban,
      title: '大神列表',
      icon: 'dashen',
      text: '大神',
    },
    {
      path: '/dashen', // 路由路径
      component: Dashen,
      title: '老板列表',
      icon: 'laoban',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]

  componentDidMount () {
    const userid = Cookies.get('userid')
    const {user} = this.props
    if(userid && !user._id) { // 只有以前登陆过, 但当前还没有登陆
      this.props.getUser() // 发请求获取用户信息, 实现自动登陆
    }

  }

  render () {

    // 检查用户以前是否登陆过
    const userid = Cookies.get('userid')
    if(!userid) {// 如果没有登陆过, 直接跳转到登陆界面
      return <Redirect to='/login'/>
    }
    // 检查当前是否已经登陆
    const {user} = this.props
    if(!user._id) { // 当前还没有登陆
      // getUser()  // 不能在render()发ajax请求
      return null // 暂时不做任何显示
    }

    // 当前已经登陆了
    const path = this.props.location.pathname  // 当前请求的path
    if(path==='/') { // 如果请求的是根路径, 自动跳转到对应的路由界面
      return <Redirect to={getRedirectPath(user.type, user.header)}/>
    }

    const navList = this.navList
    // 确定哪个nav需要隐藏(添加隐藏的标识属性)
    if(user.type==='laoban') {
      navList[1].hide = true
    } else {
      navList[0].hide = true
    }

    // 得到当前导航
    const currentNav = navList.find(nav => nav.path===path)
    return (
      <div>
        {currentNav ? <NavBar className='stick-header'>{currentNav.title}</NavBar> : null}

        <Switch>
          <Route path='/dasheninfo' component={DashenInfo}/>
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/dashen' component={Dashen}/>
          <Route path='/laoban' component={Laoban}/>
          <Route path='/message' component={Message}/>
          <Route path='/personal' component={Personal}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={NotFound}/>
        </Switch>

        {currentNav ?  <NavFooter navList={navList} unReadCount={this.props.unReadCount}/>: null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main)