import request from "@/utils/request";

export function List(params) {
  return request({
    url: "group/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "group/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "group/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "group/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "group/del",
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
