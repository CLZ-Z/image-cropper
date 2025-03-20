import request from "@/utils/request";

export function List(params) {
  return request({
    url: "classify/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "classify/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "classify/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "classify/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "classify/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "classify/get",
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
