import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  events: defineTable({
    name: v.string(),
    date: v.string(),
    description: v.string(),
  }),
  photos: defineTable({
    eventId: v.id("events"),
    storageId: v.string(),
    uploader: v.string(),
    createdAt: v.string(),
  }),
  comments: defineTable({
    photoId: v.id("photos"),
    userId: v.string(),
    text: v.string(),
    createdAt: v.string(),
  }),
});
