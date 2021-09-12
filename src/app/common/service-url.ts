export enum ServiceUrl {
  // Auth URLs
  login = 'auth/login',
  logout = 'auth/logout',
  forgotPassword = 'auth/forgotPassword',
  // Data URLs
  cropData = 'data/crops',
  seasonData = 'data/seasons',
  characterData = 'data/characters',
  planData = 'data/plans',
  observationData = 'data/observations',
  latestObservationData = 'data/latestObservations',
  observationImage = 'observation/image',
  referenceData = 'data/referenceData',
  adminData = 'data/admin',
  // Plan action URLs
  savePlan = 'plan/save',
  saveObservation = 'observation/save',
}
