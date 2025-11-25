import React, { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type PhotoUploadProps = {
  eventId: Id<"events">;
  userId: string;
};

export default function PhotoUpload({ eventId, userId }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.myFunctions.generateUploadUrl);
  const addPhoto = useMutation(api.myFunctions.addPhoto);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!fileInputRef.current?.files?.[0]) return setError("No file selected.");
    setLoading(true);

    try {
      const uploadUrl: string = await generateUploadUrl({});
      const file = fileInputRef.current.files[0];
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      await addPhoto({
        eventId,
        storageId,
        uploader: userId,
        createdAt: new Date().toISOString(),
      });
      fileInputRef.current.value = "";
    } catch (err: any) {
      setError("Upload failed: " + err?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Upload Photo</h3>
      <form onSubmit={(e) => { void handleUpload(e); }} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          required
          className="p-2 bg-white dark:bg-slate-700 rounded-md border-2 border-slate-300 dark:border-slate-600"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-md p-3 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
