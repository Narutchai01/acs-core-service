import { t } from "elysia";
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

export const BaseModelSchema = t.Object({
  createdAt: t.Optional(t.Date()),
  createdBy: t.Optional(t.Number()),
  updatedAt: t.Optional(t.Date()),
  updatedBy: t.Optional(t.Number()),
  deletedAt: t.Optional(t.Nullable(t.Date())),
});

export const CommonQueryParams = {
  page: t.Optional(t.Numeric({ default: 1, minimum: 1, examples: [1] })),
  pageSize: t.Optional(t.Numeric({ default: 10, minimum: 1, examples: [10] })),
  orderBy: t.Optional(
    t.String({ default: "createdAt", examples: ["createdAt", "name"] }),
  ),
  sortBy: t.Optional(t.String({ default: "desc", examples: ["asc", "desc"] })),
};
