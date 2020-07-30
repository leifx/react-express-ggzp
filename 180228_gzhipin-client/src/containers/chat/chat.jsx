/*
对话聊天的路由组件
 */

import React, {Component} from 'react'
import {NavBar, List, InputItem, Icon, Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg} from '../../redux/actions'
import {updateMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

  state = {
    content: '',
    isShow: false
  }

  send = () => {
    const {content} = this.state
    if(!content) {
      return
    }
    const from = this.props.user._id
    const to = this.props.match.params.userid
    // 发送消息
    this.props.sendMsg({from, to, content})

    // 清除输入消息
    this.setState({content: '', isShow: false})
  }

  componentWillMount () {// 第一次调用render渲染前调用, 调用一次
    const emojis = ['😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣']
    this.emojis = emojis.map(value => ({text: value}))
    // console.log(this.emojis)
  }

  // 打开界面, 自动滚动到底部
  componentDidMount() {
    // 初始显示列表
    window.scrollTo(0, document.body.scrollHeight)
    /*const from = this.props.match.params.userid
    const to = this.props.user._id
    this.props.updateMsg(from, to)*/
  }

  // 更新后, 自动滚动到底部
  componentDidUpdate () {
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }

  // 退出()死亡之前调用
  componentWillUnmount() {
    const from = this.props.match.params.userid
    const to = this.props.user._id
    this.props.updateMsg(from, to)
  }

  // 切换表情列表的显示
  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow) {
      // 异步手动派发resize事件,解决表情列表显示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  render() {

    const {user, chat} = this.props
    const {users, chatMsgs} = chat
    const targetId = this.props.match.params.userid
    const meId = user._id
    if(!users[targetId]) {
      return null // 不做任何显示
    }
    // 得到当前聊天的id
    const chatId = [targetId, meId].sort().join('_')

    // 对chatMsgs进行过滤(与目标用户的聊天记录)
    const currentMsgs = chatMsgs.filter(msg => msg.chat_id===chatId)
    // msg.to msg.from

    const targetUser = users[targetId]
    const targetIcon = targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null

    return (
      <div id='chat-page'>
        <NavBar icon={<Icon type='left'/>}
                onLeftClick={() => this.props.history.goBack()}
        >
          aa
        </NavBar>
        <List style={{marginBottom: 50}}>
          {
            currentMsgs.map((msg, index) => {
              if(msg.to===meId) { // 对方发给我的
                return (
                  <Item
                    key={index}
                    thumb={targetIcon}
                  >
                    {msg.content}
                  </Item>
                )
              } else { // 我发给对方的
                return (
                  <Item
                    key={index}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>

        <div className='am-tab-bar'>

          <InputItem
            placeholder="请输入"
            onChange={(val) => this.setState({content: val})}
            onFocus={() => {this.setState({isShow: false})}}
            value={this.state.content}
            extra={
              <div>
                <span role="img" onClick={this.toggleShow}>😊</span>
                <span onClick={this.send} style={{marginLeft:10}}>发送</span>
              </div>
            }
          />

          {
            this.state.isShow ? (
              <Grid
                data={this.emojis}
                columnNum={8}
                carouselMaxRow={4}
                isCarousel={true}
                onClick={(item) => {
                  this.setState({
                    content: this.state.content + item.text
                  })
                }}
              />
            ) : null
          }

        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, updateMsg}
)(Chat)