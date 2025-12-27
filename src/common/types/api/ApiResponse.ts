export type ApiResponse<T> = ApiResponseFailed | ApiResponseSuccess<T>;

export type ApiResponseFailed = {
  success: false;
  error: string;
  details?: {
    [key: string]: string[];
  };
};

export type ApiResponseSuccess<T> = {
  success: true;
  data: T;
};
