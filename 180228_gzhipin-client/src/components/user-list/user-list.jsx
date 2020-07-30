/*
用户列表的UI组件
 */
import React from 'react'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'

const Header = Card.Header
const Body = Card.Body


class UserList extends React.Component {

  static propTypes = {
    userList: PropTypes.array.isRequired
  }

  render() {
    // 只显示完善了信息的用户
    const userList = this.props.userList.filter(user => user.header)
    return (
      <WingBlank style={{marginTop: 50, marginBottom:50}}>
        <QueueAnim type='scale' delay={100}>
          {
            userList.map((user, index) => (
              <div key={index}>
                <WhiteSpace/>
                <Card onClick={() => this.props.history.push('/chat/'+user._id)}>
                  <Header
                    thumb={require(`../../assets/imgs/${user.header}.png`)}
                    extra={user.username}
                  />
                  <Body>
                  <div>职位: {user.post}</div>
                  {user.company ? <div>公司: {user.company}</div> : null}
                  {user.salary ? <div>月薪: {user.salary}</div> : null}
                  {user.salary ? <div>月薪: {user.salary}</div> : null}
                  <div>描述: {user.info}</div>
                  </Body>
                </Card>
              </div>
            ))
          }
        </QueueAnim>
      </WingBlank>
    )
  }
}

export default withRouter(UserList)