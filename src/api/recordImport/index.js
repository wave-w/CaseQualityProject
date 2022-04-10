import request from '../request';

export function getChainRegions() {
  return request({
    url: '/chinaregions',
    method: 'GET',
  });
}

export function addRecord(patientData) {
  return request({
    url: '/addrecord',
    method: 'POST',
    params: {
      patientData,
    },
  });
}
