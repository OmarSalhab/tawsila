import { ArrowLeft } from "lucide-react";

export default function GlobalChat({open, onClick}) {
  if(!open) return null
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full bg-primary py-4 flex items-center px-4">
        <button type="button" className="text-white mr-2">
          <ArrowLeft className="w-6 h-6" onClick={onClick}/>
        </button>
        <div className="flex flex-col flex-1">
          <span className="text-white text-base font-semibold">Amman-Zarqa Chat</span>
          <span className="text-white text-xs font-normal opacity-80">Route-specific ride sharing group</span>
        </div>
      </div>
      {/* Chat Body */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <p className="text-gray-400 text-lg text-center">No messages yet. Be the first to say hello!</p>
      </div>
      {/* Input Bar */}
      <form className="w-full max-w-md mx-auto flex items-center gap-2 p-3 bg-transparent fixed bottom-0 left-1/2 -translate-x-1/2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
        />
        <button
          type="button"
          className="bg-purple-400 text-white font-semibold px-5 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
} 