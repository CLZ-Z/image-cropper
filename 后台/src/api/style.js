import request from "@/utils/request";

export function List(params) {
  return request({
    url: "style/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "style/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "style/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "style/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "style/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "style/get",
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
