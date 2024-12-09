import request from '@/utils/request'

// 查询归集列表
export function listCollect(query) {
  return request({
    url: '/wallet/collect/list',
    method: 'get',
    params: query
  })
}

// 查询归集详细
export function getCollect(id) {
  return request({
    url: '/wallet/collect/' + id,
    method: 'get'
  })
}

// 新增归集
export function addCollect(data) {
  return request({
    url: '/wallet/collect',
    method: 'post',
    data: data
  })
}

// 修改归集
export function updateCollect(data) {
  return request({
    url: '/wallet/collect',
    method: 'put',
    data: data
  })
}

// 删除归集
export function delCollect(id) {
  return request({
    url: '/wallet/collect/' + id,
    method: 'delete'
  })
}
