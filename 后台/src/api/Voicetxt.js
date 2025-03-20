import request from "@/utils/request";

export function List(params) {
  return request({
    url: "Voicetxt/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "Voicetxt/count",
    method: "post",
    data: params,
  });
}
export function edit(params) {
  return request({
    url: "Voicetxt/edit",
    method: "post",
    data: params,
  });
}

export function create(params) {
  return request({
    url: "Voicetxt/create",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "Voicetxt/del",
    method: "post",
    data: params,
  });
}
export function Cquery(params) {
  return request({
    url: "Voicetxt/get",
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
