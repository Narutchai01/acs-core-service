import { mapResponse } from "../../core/interceptor/response";
import { MasterData } from "./domain/master-data";

export const masterDataDocs = {
  getAllMasterData: {
    detail: {
      summary: "Retrieve all master data",
      description: "Fetches all master data entries from the system.",
      tags: ["Master Data"],
    },
    responses: {
      200: mapResponse(MasterData),
    },
  },
};
