import { ResultCode } from './result-code';

export class AppResult {
  resultCode: ResultCode;
  resultMessage: string;
  resultData: Map<string, string>;
}
