import request from '../request';

export function getDiagnosedCaseList(name, pageNum, pageSize, ageSort, dateSort) {
  return request({
    url: '/diagnosedcaselist',
    method: 'POST',
    params: {
      name, pageNum, pageSize, ageSort, dateSort,
    },
  });
}

export function getNotDiagnosedCaseList(name, pageNum, pageSize, ageSort, dateSort) {
  return request({
    url: '/notdiagnosedcaselist',
    method: 'POST',
    params: {
      name, pageNum, pageSize, ageSort, dateSort,
    },
  });
}

export function getDiagnosedPatientDetail(id, type) {
  return request({
    url: '/diagnosedPatientDetail',
    method: 'POST',
    params: {
      id,
      type,
    },
  });
}

export function updateUltrasonicText(inspectionNum, ultrasonicDiagnosis, ultrasonicDindings) {
  return request({
    url: '/updateUltrasonic',
    method: 'POST',
    params: {
      inspectionNum,
      ultrasonicDiagnosis,
      ultrasonicDindings,
    },
  });
}
