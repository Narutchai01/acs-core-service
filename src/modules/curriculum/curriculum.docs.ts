import { t } from "elysia";
import { mapResponse } from "../../core/interceptor/response";
import { CreateCurriculumDTO, CurriculumDTO } from "./domain/curriculum";

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
    response: {
      200: mapResponse(CurriculumDTO.Array()),
      500: mapResponse(t.Null()),
    },
  },
};
