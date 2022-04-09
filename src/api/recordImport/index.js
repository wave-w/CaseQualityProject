import request from '../request';

export function getChainRegions() {
  return request({
    url: '/chinaregions',
    method: 'GET',
  });
}

export function get() {

}
