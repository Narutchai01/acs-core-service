import { PrismaClient } from "../../src/generated/prisma/client";

export const academicPositions = [
  {
    sequence: 1,
    nameTh: "อาจารย์",
    shortTh: "อ.",
    nameEn: "Lecturer",
    shortEn: "Lect.",
  },
  {
    sequence: 2,
    nameTh: "ผู้ช่วยศาสตราจารย์",
    shortTh: "ผศ.",
    nameEn: "Assistant Professor",
    shortEn: "Asst. Prof.",
  },
  {
    sequence: 3,
    nameTh: "รองศาสตราจารย์",
    shortTh: "รศ.",
    nameEn: "Associate Professor",
    shortEn: "Assoc. Prof.",
  },
  {
    sequence: 4,
    nameTh: "ศาสตราจารย์",
    shortTh: "ศ.",
    nameEn: "Professor",
    shortEn: "Prof.",
  },
  {
    sequence: 5,
    nameTh: "ศาสตราจารย์เกียรติคุณ",
    shortTh: "ศ. เกียรติคุณ",
    nameEn: "Professor Emeritus",
    shortEn: "Prof. Emeritus",
  },
  {
    sequence: 6,
    nameTh: "ศาสตราจารย์คลินิก",
    shortTh: "ศ. คลินิก",
    nameEn: "Clinical Professor",
    shortEn: "Clinical Prof.",
  },
];

export const executeSeedAcademicPositions = async (prisma: PrismaClient) => {
  for (const position of academicPositions) {
    await prisma.academicPosition.upsert({
      where: { nameTh: position.nameTh },
      update: {},
      create: {
        sequence: position.sequence,
        nameTh: position.nameTh,
        nameEn: position.nameEn,
        shortNameTh: position.shortTh,
        shortNameEn: position.shortEn,
      },
    });
  }
};
