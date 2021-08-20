import { environment } from 'src/environments/environment';
import { ResultCode } from '../common/result-code';
import { ServiceUrl } from '../common/service-url';
import { ServiceResponse } from '../data/service-response';

export class ServiceBase {
  protected getServiceUrl(serviceUri: ServiceUrl) {
    let url = `${environment.serviceBaseUrl}`;
    const uri = serviceUri.valueOf();

    if (!((url.substr(url.length - 1, 1) === '/') || (uri.substr(0, 1) === '/'))) {
      url += '/';
    }
    return url + uri;
  }

  protected hasNoError(response: ServiceResponse<any>) {
    return response.appResult.resultCode === ResultCode.noError;
  }
}
