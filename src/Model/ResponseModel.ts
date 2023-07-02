export interface ResponseModel<T> {
  message: string;
  result?: T;
  success: boolean;
}
