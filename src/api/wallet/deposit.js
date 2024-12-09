import request from '@/utils/request'

// 查询充值列表
export function listDeposit(query) {
  return request({
    url: '/wallet/deposit/list',
    method: 'get',
    params: query
  })
}

// 查询充值详细
export function getDeposit(id) {
  return request({
    url: '/wallet/deposit/' + id,
    method: 'get'
  })
}

// 新增充值
export function addDeposit(data) {
  return request({
    url: '/wallet/deposit',
    method: 'post',
    data: data
  })
}

// 修改充值
export function updateDeposit(data) {
  return request({
    url: '/wallet/deposit',
    method: 'put',
    data: data
  })
}

// 删除充值
export function delDeposit(id) {
  return request({
    url: '/wallet/deposit/' + id,
    method: 'delete'
  })
}
