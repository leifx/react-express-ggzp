/*
选择用户头像的组件
 */
import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class HeaderSelector extends Component {

  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }

  state = {
    icon: null
  }

  handleSelectHeader= ({text, icon}) =>{
    // 更新状态
    this.setState({icon})
    this.props.setHeader(text)
  }

  render () {
    const {icon} = this.state
    const header = !icon ? '请选择头像:' : <p>已选择头像:<img src={icon} alt="" /></p>
    const headers = []
    for (var i = 0; i < 20; i++) {
      const text = '头像' + (i+1)
      const icon = require(`../../assets/imgs/${text}.png`)
      headers.push({text, icon})
    }
    return (
      <List renderHeader={() => header}>
        <Grid data={headers}
            columnNum={5}
            onClick={this.handleSelectHeader}
        />
      </List>
    )
  }
}