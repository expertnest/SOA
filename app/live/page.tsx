"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Users,
  X,
  Flame,
} from "lucide-react";

export default function Live() {
  const [messages, setMessages] = useState([
    { user: "nox", text: "Welcome to the stream 🔥" },
    { user: "fan01", text: "LETS GOOOO" },
  ]);
  const [input, setInput] = useState("");
  const [showRules, setShowRules] = useState(true);

  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { user: "you", text: input }]);
    setInput("");
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl font-black">Live</h1>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <Users size={14} />
              12.4K
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">

          {/* VIDEO */}
          <div className="rounded-[34px] overflow-hidden border border-white/10 bg-zinc-950">

            <div className="relative aspect-video bg-black flex items-center justify-center">

              {/* Replace this with real stream later */}
              <video
                src="/sample.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full text-sm">
                <Flame size={14} className="text-red-400" />
                Live Now
              </div>

            </div>

          </div>

          {/* CHAT */}
          <div className="flex flex-col rounded-[34px] border border-white/10 bg-zinc-950 h-[500px] sm:h-auto">

            {/* CHAT HEADER */}
            <div className="border-b border-white/10 p-4 flex justify-between items-center">
              <h2 className="font-semibold">Live Chat</h2>
              <span className="text-xs text-zinc-500">
                {messages.length} messages
              </span>
            </div>

            {/* MESSAGES */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-cyan-300">
                    {msg.user}:
                  </span>{" "}
                  <span className="text-zinc-300">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t border-white/10 p-3 flex items-center gap-2">

              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Smile size={18} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-transparent outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                className="bg-white text-black px-3 py-2 rounded-lg"
              >
                <Send size={16} />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* RULES MODAL */}
      {showRules && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">

          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-zinc-950 p-6 relative">

            <button
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-black mb-3">
              Community Guidelines
            </h2>

            <ul className="text-sm text-zinc-400 space-y-2">
              <li>• Be respectful to everyone</li>
              <li>• No spam or self-promo</li>
              <li>• Keep it positive</li>
              <li>• No hate speech or harassment</li>
            </ul>

            <button
              onClick={() => setShowRules(false)}
              className="mt-5 w-full rounded-full bg-white text-black py-2 font-semibold"
            >
              I Understand
            </button>

          </div>

        </div>
      )}

    </div>
  );
}