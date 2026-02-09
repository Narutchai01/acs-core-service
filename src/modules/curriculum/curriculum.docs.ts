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
};
