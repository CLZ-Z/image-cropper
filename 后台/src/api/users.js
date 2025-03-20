import request from "@/utils/request";

export function List(params) {
  return request({
    url: "user/paging",
    method: "post",
    data: params,
  });
}
export function count(params) {
  return request({
    url: "user/count",
    method: "post",
    data: params,
  });
}

export function edit(params) {
  return request({
    url: "user/userEdit",
    method: "post",
    data: params,
  });
}
export function del(params) {
  return request({
    url: "user/del",
    method: "post",
    data: params,
  });
}
