import { TagGroup, Tag } from "../../src/core/models/tag";
import { PrismaClient } from "../../src/generated/prisma/client";

export const tagGroups: Array<Omit<TagGroup, "tags">> = [
  {
    id: 1,
    name: "type",
  },
  {
    id: 2,
    name: "field",
  },
  {
    id: 3,
    name: "category",
  },
  {
    id: 4,
    name: "news",
  },
];

export const tags: Array<Omit<Tag, "id">> = [
  {
    name: "Artificial intelligence",
    tagsGroupsId: 2,
  },
  {
    name: "Network",
    tagsGroupsId: 2,
  },
  {
    name: "Cloud computing",
    tagsGroupsId: 2,
  },
  {
    name: "Security",
    tagsGroupsId: 2,
  },
  {
    name: "Computer Architecture",
    tagsGroupsId: 2,
  },
  {
    name: "Software Engineering",
    tagsGroupsId: 2,
  },
  {
    name: "Computational Theory",
    tagsGroupsId: 2,
  },
  {
    name: "GIS",
    tagsGroupsId: 2,
  },
  {
    name: "Game Design",
    tagsGroupsId: 2,
  },
  {
    name: "Data Science and analytics",
    tagsGroupsId: 2,
  },
  {
    name: "Data Structures and Algorithms",
    tagsGroupsId: 2,
  },
  {
    name: "Research",
    tagsGroupsId: 1,
  },
  {
    name: "Web Application",
    tagsGroupsId: 1,
  },
  {
    name: "Mobile Application",
    tagsGroupsId: 1,
  },
  {
    name: "Internet Of Things",
    tagsGroupsId: 1,
  },

  {
    name: "ข่าวประชาสัมพันธ์",
    tagsGroupsId: 4,
  },
  {
    name: "ความสำเร็จนักศึกษา",
    tagsGroupsId: 4,
  },
  {
    name: "งานกิจกรรมนักศึกษา",
    tagsGroupsId: 4,
  },
  {
    name: "announcement",
    tagsGroupsId: 4,
  },
  {
    name: "newshighlight",
    tagsGroupsId: 4,
  },
  {
    name: "Education",
    tagsGroupsId: 3,
  },
  {
    name: "Medical",
    tagsGroupsId: 3,
  },
  {
    name: "Research Category", // Changed to avoid duplicate
    tagsGroupsId: 3,
  },
  {
    name: "Business",
    tagsGroupsId: 3,
  },
  {
    name: "Game",
    tagsGroupsId: 3,
  },
  {
    name: "Agricultural",
    tagsGroupsId: 3,
  },
];

export const executeSeedTags = async (prisma: PrismaClient) => {
  for (const tagGroup of tagGroups) {
    await prisma.tageGroups.upsert({
      where: { id: tagGroup.id },
      update: {},
      create: {
        id: tagGroup.id,
        name: tagGroup.name,
      },
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
        tageGroupsId: tag.tagsGroupsId,
      },
    });
  }
};
