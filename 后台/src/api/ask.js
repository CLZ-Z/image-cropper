import request from "@/utils/request";

export function List(params) {
  return request({
    url: "ask/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "ask/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "ask/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "ask/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "ask/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "ask/get",
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
