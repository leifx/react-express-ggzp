/*
注册的容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, WingBlank, List, WhiteSpace, InputItem, Radio, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const ListItem = List.Item

class Register extends Component {

  state = {
    username: '',
    password: '',
    password2: '',
    type: 'dashen'
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value  // 如何让一个属性名是一个变量: 将属性变量名放在[]中
    })
  }
  // handleChange('username', 'abc')
  // handleChange('password', '123')
  // handleChange('type', 'laoban')

  register = () => {
    this.props.register(this.state)
  }
  goLogin = () => {
    this.props.history.replace('/login')
  }

  render () {
    const {type} = this.state
    const {redirectTo, msg} = this.props.user
    if(redirectTo) {// 需要自动重定向
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>用户注册</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <p className='error-msg'>{msg}</p> : null}
            <WhiteSpace/>
            <InputItem placeholder="请输入用户名" onChange={val => this.handleChange('username', val)}>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem type='password' placeholder="请输入密码" onChange={val => this.handleChange('password', val)}>密码:</InputItem>
            <WhiteSpace/>
            <InputItem type='password' placeholder="请输入确认密码" onChange={val => this.handleChange('password2', val)}>确认密码:</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>用户类型:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio onChange={() => this.handleChange('type', 'dashen')} checked={type==='dashen'}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio onChange={() => this.handleChange('type', 'laoban')} checked={type==='laoban'}>老板</Radio>
            </ListItem>
            <WhiteSpace/>

            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.goLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>

    )
  }
}

export default connect(
  state => ({user: state.user}),

  {register},
  /*function (dispatch) {
    return {
      register (user) {
        dispatch(register(user))
      }
    }
  }*/
)(Register)