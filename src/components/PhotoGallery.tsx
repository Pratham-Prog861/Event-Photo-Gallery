import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import PhotoUpload from "./PhotoUpload";
import CommentSection from "./CommentSection";

// Pass userId from your authenticated parent/app
export default function PhotoGallery({ userId }: { userId: string }) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<Id<"events"> | null>(null);

  const createEvent = useMutation(api.myFunctions.createEvent);
  
  // Query all events
  const events = useQuery(api.myFunctions.getEvents, {}) ?? [];
  
  // Auto-select first event if none selected
  const selectedEvent = selectedEventId 
    ? events.find(e => e._id === selectedEventId)
    : events[0];

  // Query photos for the selected eventId
  const photos = useQuery(
    api.myFunctions.getEventPhotos,
    selectedEvent ? { eventId: selectedEvent._id } : "skip"
  ) ?? [];

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;
    
    const newEventId = await createEvent({
      name: eventName,
      date: eventDate || new Date().toISOString().split('T')[0],
      description: eventDescription,
    });
    
    setEventName("");
    setEventDate("");
    setEventDescription("");
    setShowEventForm(false);
    setSelectedEventId(newEventId);
  };

  if (events.length === 0 && !showEventForm) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg">No events available. Please create one!</p>
        <button
          onClick={() => setShowEventForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Create Event
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Event Creation Form */}
      {showEventForm && (
        <div className="mb-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={(e) => { void handleCreateEvent(e); }} className="flex flex-col gap-4">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event Name"
              required
              className="p-3 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="p-3 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
            />
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Event Description"
              rows={3}
              className="p-3 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event Selection */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <h2 className="text-2xl font-bold">Select Event:</h2>
        <div className="flex gap-2 flex-wrap">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => setSelectedEventId(event._id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedEvent?._id === event._id
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {event.name}
            </button>
          ))}
          <button
            onClick={() => setShowEventForm(true)}
            className="px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white"
          >
            + New Event
          </button>
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">{selectedEvent.name}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Date: {selectedEvent.date}</p>
          {selectedEvent.description && (
            <p className="text-slate-700 dark:text-slate-300">{selectedEvent.description}</p>
          )}
        </div>
      )}

      {/* Photo Upload */}
      {selectedEvent && (
        <div className="mb-8">
          <PhotoUpload eventId={selectedEvent._id} userId={userId} />
        </div>
      )}

      {/* Photo Gallery */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <img
                src={photo.url || ""}
                alt="Event photo"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Uploaded by: {photo.uploader}
                </p>
                <CommentSection photoId={photo._id} userId={userId} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No photos yet. Upload the first photo!
        </div>
      )}
    </div>
  );
}
