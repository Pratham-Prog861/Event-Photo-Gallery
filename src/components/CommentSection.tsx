import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type CommentSectionProps = {
  photoId: Id<"photos">;
  userId: string;
};

export default function CommentSection({ photoId, userId }: CommentSectionProps) {
  const comments = useQuery(api.myFunctions.getCommentsForPhoto, { photoId }) ?? [];
  const addComment = useMutation(api.myFunctions.addComment);

  const [text, setText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    
    setIsAdding(true);
    try {
      await addComment({
        photoId,
        userId: userId,
        text,
        createdAt: new Date().toISOString(),
      });
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-semibold text-sm">Comments ({comments.length})</h4>
      
      {/* Comments List */}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="bg-slate-50 dark:bg-slate-700 p-2 rounded text-sm">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{c.userId}</span>
            <p className="text-slate-700 dark:text-slate-300 mt-1">{c.text}</p>
            <span className="text-xs text-slate-400">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={(e) => { void handleAdd(e); }} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment..."
          disabled={isAdding}
          className="flex-1 p-2 text-sm rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isAdding || !text.trim()}
          className="px-3 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "..." : "Post"}
        </button>
      </form>
    </div>
  );
}
