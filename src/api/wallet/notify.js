import request from '@/utils/request'

// 查询通知列表
export function listNotify(query) {
  return request({
    url: '/wallet/notify/list',
    method: 'get',
    params: query
  })
}

// 查询通知详细
export function getNotify(id) {
  return request({
    url: '/wallet/notify/' + id,
    method: 'get'
  })
}

// 新增通知
export function addNotify(data) {
  return request({
    url: '/wallet/notify',
    method: 'post',
    data: data
  })
}

// 修改通知
export function updateNotify(data) {
  return request({
    url: '/wallet/notify',
    method: 'put',
    data: data
  })
}

// 删除通知
export function delNotify(id) {
  return request({
    url: '/wallet/notify/' + id,
    method: 'delete'
  })
}
