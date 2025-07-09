export type BaseResponse<T> = {
  error: boolean;
  errorMessages?: string[];
  result?: T;
  statusCode?: number;
  timestamp?: string;
}
