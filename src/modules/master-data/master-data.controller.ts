import Elysia from "elysia";
import { MasterDataService } from "./master-data.service";
import { MasterDataRepository } from "../../infrastructure/master-data.repository";
import { prisma } from "../../lib/db";
import { masterDataDocs } from "./master-data.docs";
import { success } from "../../core/interceptor/response";

const masterDataRepository = new MasterDataRepository(prisma);
const masterDataService = new MasterDataService(masterDataRepository);
export const MasterDataController = (app: Elysia) =>
  app.group("/master-data", (app) =>
    app.decorate("masterDataService", masterDataService).get(
      "",
      async ({ masterDataService, set }) => {
        const masterData = await masterDataService.getMasterData();
        set.status = 200;
        return success(masterData, "Master data retrieved successfully");
      },
      masterDataDocs.getAllMasterData,
    ),
  );
