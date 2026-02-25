import { t } from "elysia";
import { mapResponse } from "../../core/interceptor/response";
import {
  CreateCurriculumDTO,
  CurriculumDTO,
  CurriculumIdParam,
  CurriculumQueryParams,
} from "./domain/curriculum";
import { Pageable } from "../../core/models";

export const CurriculumDocs = {
  createCurruculum: {
    detail: {
      summary: "Create a new curriculum",
      description: "Create a new curriculum with the provided information",
      tags: ["Curriculum"],
    },
    body: CreateCurriculumDTO,
    response: {
      201: mapResponse(CurriculumDTO),
    },
  },

  getCurriculums: {
    detail: {
      summary: "Get list of curriculums",
      description: "Retrieve a list of all curriculums",
      tags: ["Curriculum"],
    },
    query: CurriculumQueryParams,
    response: {
      200: mapResponse(Pageable(CurriculumDTO)),
      500: mapResponse(t.Null()),
    },
  },

  getCurriculumById: {
    detail: {
      summary: "Get curriculum by ID",
      description: "Retrieve a specific curriculum by its unique ID",
      tags: ["Curriculum"],
    },
    params: CurriculumIdParam,
    response: {
      200: mapResponse(CurriculumDTO),
      404: mapResponse(t.Null()),
    },
  },
};
