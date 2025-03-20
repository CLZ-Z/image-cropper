import request from "@/utils/request";

export function List(params) {
  return request({
    url: "ParentChild/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "ParentChild/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "ParentChild/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "ParentChild/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "ParentChild/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "ParentChild/get",
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

export function recordCreate(params) {
  return request({
    url: "record/create",
    method: "post",
    data: params,
  });
}
