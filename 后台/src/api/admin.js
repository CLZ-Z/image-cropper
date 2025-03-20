import request from "@/utils/request";

export function login(data) {
  return request({
    url: "admin/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  return request({
    url: "admin/query",
    method: "post",
    data: token,
  });
}

export function logout(token) {
  return request({
    url: "admin/query",
    method: "post",
    data: token,
  });
}

export function create(params) {
  return request({
    url: "admin/create",
    method: "post",
    data: params,
  });
}

export function List(params) {
  return request({
    url: "admin/paging",
    method: "post",
    data: params,
  });
}

export function count(params) {
  return request({
    url: "admin/count",
    method: "post",
    data: params,
  });
}

export function edit(params) {
  return request({
    url: "admin/edit",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "admin/del",
    method: "post",
    data: params,
  });
}
export function uploads(params) {
  return request({
    url: "UDD/upload",
    method: "post",
    data: params,
  });
}
