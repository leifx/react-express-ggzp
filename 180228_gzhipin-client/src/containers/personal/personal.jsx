/*
个人中心路由
 */
/*
用户个人中心路由组件
 */

import React from 'react'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'
const Item = List.Item
const Brief = Item.Brief

class Personal extends React.Component {

  logout = () => {
    Modal.alert('退出', '确认退出登陆吗?', [
      {
        text: '取消',
      },
      {
        text: '确认',
        onPress: () => {
          // 清除cooike中的userid
          Cookies.remove('userid')
          // 重置redux中的user状态
          this.props.resetUser()
        }
      },
    ])
  }

  render() {
    const {username, post, salary, info, company, header} = this.props.user
    return (
      <div style={{marginTop: 50}}>
        <Result
          img={<img src={require(`../../assets/imgs/${header}.png`)} style={{width: 50}} alt="header"/>}
          title={username}
          message={company?company:null}
        />

        <List renderHeader={() => '相关信息'}>
          <Item multipleLine>
            <Brief>职位: {post}</Brief>
            <Brief>简介: {info}</Brief>
            {salary ? <Brief>薪资: {salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace/>
        <List>
          <Button type='warning' onClick={this.logout}>退出登录</Button>
        </List>
      </div>
    )
  }
}

export default connect(
  state =>({user: state.user}),
  {resetUser}
)(Personal)