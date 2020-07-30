/*
大神的信息完善组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'

class DashenInfo extends Component {

  state = {
    header: '',
    post: '',
    info: ''
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  setHeader = (header) => {
    this.setState({header})
  }

  save = () => {
    this.props.updateUser(this.state)
  }

  render () {
    const {header} = this.props.user
    // 如果已经完善了, 自动跳转到对应的主界面
    if(header) {
      return <Redirect to='/dashen'/>
    }

    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <InputItem placeholder='求职岗位' onChange={value => this.handleChange('post', value)}>求职岗位:</InputItem>
        <TextareaItem title='个人介绍:' rows={3} placeholder='个人介绍'
                      onChange={value => this.handleChange('info', value)}/>
        <Button type='primary' onClick={this.save}>保存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(DashenInfo)