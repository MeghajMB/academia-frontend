export interface ApiSuccessResponse<T> {
  status: "success";
  code: 200 | 201 | 204;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: "error";
  code: 400 | 401 | 403 | 404 | 500 | 503 | 409 | 0;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
