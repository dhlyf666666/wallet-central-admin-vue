import request from '@/utils/request'

// 查询手续费转账列表
export function listTransfer(query) {
  return request({
    url: '/wallet/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询手续费转账详细
export function getTransfer(id) {
  return request({
    url: '/wallet/transfer/' + id,
    method: 'get'
  })
}

// 新增手续费转账
export function addTransfer(data) {
  return request({
    url: '/wallet/transfer',
    method: 'post',
    data: data
  })
}

// 修改手续费转账
export function updateTransfer(data) {
  return request({
    url: '/wallet/transfer',
    method: 'put',
    data: data
  })
}

// 删除手续费转账
export function delTransfer(id) {
  return request({
    url: '/wallet/transfer/' + id,
    method: 'delete'
  })
}
