import { mapResponse } from "../../core/interceptor/response";
import { CreateProfrssorDTO, ProfessorDTO } from "./domain/professor";

export const ProfessorDocs = {
  createProfessor: {
    detail: {
      summary: "Creates a new professor in the system.",
      description:
        "This endpoint allows for the creation of a new professor by accepting the necessary data and returning the created professor's details.",
      tags: ["Professors"],
    },
    body: CreateProfrssorDTO,
    responses: {
      201: mapResponse(ProfessorDTO),
    },
  },
};
