import request from "@/utils/request";

export function List(params) {
  return request({
    url: "SubjectiveQuestion/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "SubjectiveQuestion/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "SubjectiveQuestion/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "SubjectiveQuestion/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "SubjectiveQuestion/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "SubjectiveQuestion/get",
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
