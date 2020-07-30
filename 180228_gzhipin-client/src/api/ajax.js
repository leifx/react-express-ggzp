/*
通用的ajax请求函数模块
封装的是axios
函数的返回值是promise对象
 */
import axios from 'axios'

export default function ajax(url, data={}, type="GET") {

  if(type==='GET') {

    // 对参数拼串
    // data={username:'Tom', password: '123'}
    // url?username=tom&password=123
    let queryStr = ''
    Object.keys(data).forEach(key => {
      const value = data[key]
      queryStr += key + '=' + value + '&'
    })
    if(queryStr) {
      queryStr = queryStr.substring(0, queryStr.length-1)
    }
    // 发送get类型的ajax请求
    return axios.get(url+'?'+queryStr)
  } else {
    // 发送post类型的ajax请求
    return axios.post(url, data)
  }


}