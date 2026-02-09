import { t } from "elysia";
import { mapResponse } from "../../core/interceptor/response";
import {
  CreateProfrssorDTO,
  ProfessorDTO,
  ProfessorQueryParams,
} from "./domain/professor";

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
  getProfessors: {
    detail: {
      summary: "Retrieves a list of professors.",
      description:
        "This endpoint fetches a list of all professors in the system, returning their details.",
      tags: ["Professors"],
    },
    query: ProfessorQueryParams,
    responses: {
      200: mapResponse(t.Array(ProfessorDTO)),
    },
  },
  getProfessorById: {
    detail: {
      summary: "Retrieves a professor by ID.",
      description:
        "This endpoint fetches the details of a specific professor using their unique ID.",
      tags: ["Professors"],
    },
    params: t.Object({
      id: t.Number(),
    }),
    responses: {
      200: mapResponse(ProfessorDTO),
      404: mapResponse(t.Null()),
    },
  },
};
