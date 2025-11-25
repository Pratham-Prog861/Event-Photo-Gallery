import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Queries
export const getEventPhotos = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const photos = await ctx.db.query("photos").filter(q => q.eq(q.field("eventId"), eventId)).collect();
    // Add image URLs to photos
    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );
  },
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const getCommentsForPhoto = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, { photoId }) => {
    return await ctx.db.query("comments").filter(q => q.eq(q.field("photoId"), photoId)).collect();
  },
});

// Mutations
export const addPhoto = mutation({
  args: {
    eventId: v.id("events"),
    storageId: v.string(),
    uploader: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("photos", args);
  },
});

export const addComment = mutation({
  args: {
    photoId: v.id("photos"),
    userId: v.string(),
    text: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", args);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, _args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getEvents = query({
  args: {},
  handler: async (ctx, _args) => {
    return await ctx.db.query("events").collect();
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    date: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", args);
    return eventId;
  },
});

export const getViewer = query({
  args: {},
  handler: async (ctx, _args) => {
    return ctx.auth.getUserIdentity() ?? { subject: "anon" };
  },
});