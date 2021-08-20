import { AppResult } from '../common/app-result';

export class ServiceResponse<T> {
  appResult: AppResult;
  appData: T;
}
