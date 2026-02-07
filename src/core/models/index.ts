export interface BaseModel {
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
  deletedAt?: Date | null;
}

export interface Pageable<T> {
  rows: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

export interface ResponseModel<T> {
  data: T;
  status: number;
  message?: string;
  err?: string;
}
