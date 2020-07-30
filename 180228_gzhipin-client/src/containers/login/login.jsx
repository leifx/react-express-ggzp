/*
登陆的容器组件
 */
import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  // 处理输入框/单选框变化, 收集数据到state
  handleChange = (name, value) => {
    this.setState({[name]: value})
  }

  // 跳转到注册路由
  toRegister = () => {
    this.props.history.replace('/register')
  }

  // 登陆
  login = () => {
    const {username, password} = this.state
    this.props.login(username, password)
  }

  render() {

    const {redirectTo, msg} = this.props.user
    if(redirectTo) {// 需要自动重定向
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>硅谷直聘</NavBar>
        <Logo/>
        <WingBlank> 
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : null}
            <InputItem
              placeholder='输入用户名'
              onChange={val => this.handleChange('username', val)}
            >
              用户名:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              placeholder='输入密码'
              onChange={val => this.handleChange('password', val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {login}
)(Login)