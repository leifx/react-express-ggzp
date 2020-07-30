/*
包含n个action creator函数的模块
同步action(与type的个数一样)
异步action(与异步ajax请求个数一样)
 */
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG,
  RECEIVE_CHAT,
  MSG_UPDATE
} from './action-types'
import {
  reqLogin,
  reqRegister,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadChatMsg
} from '../api'
import io from 'socket.io-client'
// 连接服务器, 得到代表连接的socket对象
const socket = io('ws://localhost:4000')

/*
初始化socketio, 绑定监听接收服务器发送的消息
 */
function initSocketIO (userid, dispatch) {
  if(!io.socket) {
    io.socket = socket
    socket.on('receiveMsg', function (chatMsg) {
      if(chatMsg.from===userid || chatMsg.to===userid) {
        console.log('接收到一个需要显示的消息')
        dispatch(receiveMsg(chatMsg, userid))
      } else {
        console.log('接收到一条与我无关消息')
      }
    })
  }

}

/*
获取当前用户相关的所有聊天信息的异步action
 */
async function getMsgList (userid, dispatch) {
  initSocketIO(userid, dispatch)
  const response = await reqChatMsgList()
  const result = response.data
  if(result.code===0) {
    // {user: {}, chatMsgs: []}
    console.log('获取得到当前用户的所有聊天相关信息', result.data)
    dispatch(receiveChat({...result.data, meId: userid}))
  }
}


// 请求成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

// 请求失败的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})

// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})

// 接收用户列表的同步action
const receiveUserList = (users) => ({type: RECEIVE_USER_LIST, data: users})

// 接收聊天相关信息的同步action
const receiveChat = ({users, chatMsgs, meId}) => ({type: RECEIVE_CHAT, data: {users, chatMsgs, meId}})
// 接收一条新的聊天消息
const receiveMsg = (chatMsg, meId) => ({type: RECEIVE_MSG, data: {chatMsg, meId}})

const msgUpdate = ({count, from, to}) => ({type: MSG_UPDATE, data: {count, from, to}})


// 注册的异步action
export const register = ({username, password,password2, type}) => {
  if(!username) {
    return errorMsg('必须指定用户名')
  } else if(!password) {
    return errorMsg('必须指定密码')
  }

  return async dispatch => {
    if(password!==password2) {
      dispatch(errorMsg('两个密码必须一致'))
      return
    }
    // 执行异步ajax请求注册接口
    // 以同步编码方式得到promise异步执行的结果
    const response = await reqRegister({username, password, type})
    const result = response.data  // {code: 0/1: data/msg: ???}
    if(result.code===0) { // 注册成功
      const user = result.data
      getMsgList(user._id, dispatch)
      dispatch(authSuccess(user)) // 分发一个成功同步action
    } else { // 注册失败
      dispatch(errorMsg(result.msg)) // 分发一个失败同步action
    }
  }
}

// 登陆的异步action
export const login = (username, password) => {

  if(!username) {
    return errorMsg('必须指定用户名')
  } else if(!password) {
    return errorMsg('必须指定密码')
  }

  return async dispatch => {
    // 执行异步ajax请求登陆接口
    const response = await reqLogin(username, password)
    const result = response.data  // {code: 0/1: data/msg: ???}
    if(result.code===0) { // 注册成功
      const user = result.data
      getMsgList(user._id, dispatch)
      dispatch(authSuccess(user)) // 分发一个成功同步action
    } else { // 注册失败
      dispatch(errorMsg(result.msg)) // 分发一个失败同步action
    }
  }
}


// 更新用户的异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code===0) {
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户的异步action
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if(result.code===0) {
      getMsgList(result.data._id, dispatch)
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}


// 获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data
    if(result.code===0) { // {code: 0, data: users}
      dispatch(receiveUserList(result.data))
    }
  }
}


// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    // 向服务器发消息
    console.log('浏览器向服务器发送消息', from, to, content)
    socket.emit('sendMsg', {from, to, content})
  }
}


// 更新消息为已读
export const updateMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadChatMsg(from)
    const result = response.data // {code: 0, data: 2}
    if(result.code===0) {
      const count = result.data
      dispatch(msgUpdate({count, from, to}))
    }

  }
}


/*
async和await的作用?:
  简化promise编码
  使用同步编码实现异步流程
哪里使用await?
  在执行一个返回promise对象的函数的左侧(不是想得到promise, 最想得到异步执行的结果)
哪里使用async?
  使用了await所在的函数定义左侧
 */