/*
消息列表路由
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
const Brief = Item.Brief

/*
根据chatMsg得到所有聊天的最后聊天msg的数组
1. 创建一个用于保存所有lastMsg的对象容器: lastMsgObjs
2. 遍历每个msg, 判断msg是否是它对应的聊天lastMsg, 如果是放入
3. 得到lastMsgObjs中所有属性值组成的数组: lastMsgs
4. 对lastMsgs进行排序(倒序)
 */
function getLastMsgs (chatMsgs, meId) {
  // 1. 创建一个用于保存所有lastMsg的对象容器: lastMsgObjs
  const lastMsgObjs = {}

  // 2. 遍历每个msg, 判断msg是否是它对应的聊天lastMsg, 如果是放入
  chatMsgs.forEach(msg => {

    // 统计msg自身的unReadCount
    if(!msg.read && msg.to===meId) { // 如果msg是别人发给我的未读消息
      msg.unReadCount = 1
    } else {
      msg.unReadCount = 0
    }

    const chatId = msg.chat_id
    const lastMsg = lastMsgObjs[chatId]
    if(!lastMsg) { // 当前聊天, 还没有lastMsg
      lastMsgObjs[chatId] = msg
    } else { // 当前聊天, 已经有lastMsg
      // 计算最新的未读数量
      const unReadCount = lastMsg.unReadCount + msg.unReadCount

      if(msg.create_time>lastMsg.create_time) { // 如果当前msg最晚
        lastMsgObjs[chatId] = msg
      }

      // 给最新的lastMsg指定unReadCount
      lastMsgObjs[chatId].unReadCount = unReadCount
    }
  })
  // 3. 得到lastMsgObjs中所有属性值组成的数组: lastMsgs
  const lastMsgs = Object.values(lastMsgObjs)

  // 4. 对lastMsgs进行排序(按create_time倒序)
  lastMsgs.sort(function (m1, m2) {
    return m2.create_time - m1.create_time
  })

  return lastMsgs
}

class Message extends Component {


  render() {

    const {user, chat} = this.props
    const {users, chatMsgs} = chat
    const meId = user._id

    // 根据chatMsg得到所有聊天的最后聊天msg的数组
    const lastMsgs = getLastMsgs(chatMsgs, meId)

    return (
      <List style={{marginTop: 50, marginBottom: 50}}>
        {/*alpha left right top bottom scale scaleBig scaleX scaleY*/}
        <QueueAnim type='scale' delay={100}>
          {
            lastMsgs.map((msg, index) => {
              const targetId = msg.from===meId ? msg.to : msg.from
              const targetUser = users[targetId]
              const icon = targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null
              return (
                <Item
                  key={index}
                  extra={<Badge text={msg.unReadCount}/>}
                  thumb={icon}
                  arrow='horizontal'
                  onClick={() => this.props.history.push(`/chat/${targetId}`)}
                >
                  {msg.content}
                  <Brief>{targetUser.username}</Brief>
                </Item>
              )
            })
          }
        </QueueAnim>
      </List>
    )
  }
}

export default connect(
  state =>({user: state.user, chat: state.chat}),
  {}
)(Message)