import {
  CreateCourseDTO,
  CourseDTO,
  CourseQueryParams,
  UpdateCourseDTO,
  BatchCourseResponseDTO,
  CourseCreatePayload
} from "./domain/course";
import { parse } from "csv-parse/sync";
import * as xlsx from "xlsx";
import { Value } from "@sinclair/typebox/value";
import { ICourseRepository } from "../courses/domain/course.repository";
import { ICourseFactory } from "./course.factory";
import { PrismaClient } from "../../generated/prisma/client";
import { PageableType } from "../../core/models";
interface ICourseService {
  createCourse(data: CreateCourseDTO, createdBy: number): Promise<CourseDTO>;
  getCourses(query: CourseQueryParams): Promise<PageableType<typeof CourseDTO>>;
  getCourseByID(id: number): Promise<CourseDTO | null>;
  importCoursesFromFile(file: File, userID: number): Promise<BatchCourseResponseDTO>;
}

export class CourseService implements ICourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly courseFactory: ICourseFactory,
    private readonly db: PrismaClient,
  ) { }

  async createCourse(data: CreateCourseDTO, createdBy: number): Promise<CourseDTO> {
    const { preCoursesID, ...courseData } = data;

    const course = await this.courseRepository.createCourse({
      ...courseData,
      createdBy: createdBy || 0,
      updatedBy: 0,
    },
      preCoursesID ?? []
    );

    return this.courseFactory.mapCourseToDTO(course);
  }

  async getCourses(
    query: CourseQueryParams,
  ): Promise<PageableType<typeof CourseDTO>> {
    const [courses, total] = await Promise.all([
      this.courseRepository.getCoures(query),
      this.courseRepository.countCourse(query),
    ]);

    return {
      rows: this.courseFactory.mapCourseListToDTO(courses),
      totalRecords: total,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    };
  }

  async getCourseByID(id: number): Promise<CourseDTO | null> {
    const course = await this.courseRepository.getCourseById(id);
    if (!course) {
      return null;
    }
    return this.courseFactory.mapCourseToDTO(course);
  }

  async updateCourse(courseId: number, data: UpdateCourseDTO, updatedBy: number): Promise<CourseDTO | null> {
    const { newPrecourseId, deletePrecourseId, ...courseData } = data;
    const course = await this.courseRepository.updateCourse(
      courseId,
      {
        ...courseData,
        updatedBy: updatedBy || 0,
      },
      newPrecourseId ?? [],
      deletePrecourseId ?? []
    );
    if (!course) return null;

    return this.courseFactory.mapCourseToDTO(course);
  }

  async deleteCourse(courseId: number, updatedBy: number): Promise<CourseDTO | null> {
    const course = await this.courseRepository.deleteCourse(
      courseId,
      updatedBy || 0,
    );
    if (!course) return null;

    return this.courseFactory.mapCourseToDTO(course);
  }

  async importCoursesFromFile(file: File, userID: number): Promise<BatchCourseResponseDTO> {
    const isCSV = file.name.endsWith(".csv") || file.type === "text/csv";
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isCSV && !isExcel) {
      throw new Error("Invalid file format. Only CSV and Excel are allowed.");
    }

    let records: Record<string, string>[] = [];

    if (isCSV) {
      const text = await file.text();
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } else {
      const buffer = await file.arrayBuffer();
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawRecords = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { raw: false, defval: "" });

      records = rawRecords.map(row => {
        const trimmedRow: Record<string, string> = {};
        for (const key in row) {
          trimmedRow[key.trim()] = String(row[key]).trim();
        }
        return trimmedRow;
      });
    }

    if (records.length === 0) {
      throw new Error("File is empty or contains no valid data rows.");
    }

    const uniqueRecords: Record<string, string>[] = [];
    const duplicateRecords: string[] = [];
    const seen = new Set<string>();

    for (const record of records) {
      const hash = JSON.stringify(record);
      if (!seen.has(hash)) {
        seen.add(hash);
        uniqueRecords.push(record);
      } else {
        duplicateRecords.push(record.courseCode);
      }
    }

    const { validRecords, failedRecords } = uniqueRecords.reduce(
      (acc, row, i) => {
        const rowNum = i + 1;
        const parsedRow = {
          ...row,
          typeCourseID: row.typeCourseID ? Number(row.typeCourseID) : undefined,
          curriculumID: row.curriculumID ? Number(row.curriculumID) : undefined,
        };

        if (!Value.Check(CreateCourseDTO, parsedRow)) {
          const errors = [...Value.Errors(CreateCourseDTO, parsedRow)];
          acc.failedRecords.push({
            row: rowNum,
            reason: `Invalid format: ${errors.map((e) => e.path + " " + e.message).join(", ")}`,
          });
        } else {
          acc.validRecords.push({
            ...parsedRow,
            createdBy: userID,
            updatedBy: userID,
          } as CourseCreatePayload);
        }

        return acc;
      },
      {
        validRecords: [] as CourseCreatePayload[],
        failedRecords: [] as { row: number; reason: string }[],
      }
    );

    if (validRecords.length > 0) {
      await this.db.$transaction(async (transaction) => {
        await this.courseRepository.createManyCourses(
          transaction,
          validRecords,
        );
      });
    }

    return this.courseFactory.mapBatchCourseResponse(
      records.length,
      validRecords.length,
      failedRecords,
      duplicateRecords
    );
  }
}
