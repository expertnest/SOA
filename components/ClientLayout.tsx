"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import useIsMobile from "@/hooks/useIsMobile";
import MusicPlayer from "@/components/mobileUI/MusicPlayer";
import { MusicProvider } from "@/hooks/MusicContext";
import { User, X } from "lucide-react";

// 👇 Clerk
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navItems = [
  "HOME",
  "MUSIC",
  "VIDEOS",
  "TOUR",
  "SHOP",
  "ABOUT",
  "LIVE",
  "CONTACT",
];

const navLinks: Record<string, string> = {
  HOME: "/",
  MUSIC: "/music",
  VIDEOS: "/videos",
  TOUR: "/tour",
  SHOP: "/shop",
  ABOUT: "/about",
  LIVE: "/live",
  CONTACT: "/contact",
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const hideSidebars = useIsMobile();
  const pathname = usePathname();

  // 👇 Clerk auth state
  const { isSignedIn } = useUser();

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const [messages, setMessages] = useState([
    { user: "system", text: "Welcome to the live chat 🔥" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { user: "you", text: chatInput }]);
    setChatInput("");
  };

  const mobileMainNav = ["HOME", "MUSIC", "VIDEOS", "TOUR"];
  const mobileMoreNav = ["SHOP", "ABOUT", "LIVE", "CONTACT"];

  return (
    <MusicProvider>
      <div className="relative w-full h-screen flex flex-col bg-black text-white overflow-hidden">
        <div className="flex flex-1 min-h-0">
          {!hideSidebars && <LeftSidebar />}

          <div className="flex-1 flex flex-col min-h-0 bg-black">
            {/* DESKTOP TOP NAV */}
            {!hideSidebars && (
              <div className="w-full flex justify-center px-6 py-4 border-b border-gray-800 shrink-0">
                <div className="w-full max-w-[1400px] flex justify-center">
                  <div className="flex items-center justify-between w-full px-8 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="text-xs tracking-[0.35em] text-white font-semibold">
                      SOA
                    </div>

                    <div className="flex items-center gap-8">
                      {navItems.map((item) => (
                        <Link
                          key={item}
                          href={navLinks[item]}
                          className="text-[11px] tracking-[0.28em] text-white/50 hover:text-white transition"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>

                    {/* ✅ CLERK DESKTOP AUTH */}
                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                      {!isSignedIn ? (
                        <SignInButton mode="modal">
                          <button className="text-xs text-white/60 hover:text-white transition">
                            LOGIN
                          </button>
                        </SignInButton>
                      ) : (
                        <UserButton />
                      )}

<Link href="/profile" className="cursor-pointer hover:opacity-80">
  <User className="w-5 h-5 text-white" />
</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-1 min-h-0">
              <main
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto min-h-0"
              >
                <div className="min-h-full pb-[140px]">{children}</div>
              </main>

              {!hideSidebars && (
                <div className="w-[270px] flex flex-col border-l border-gray-800">
                  {!isSignedIn ? (
                    <RightSidebar />
                  ) : (
                    <div className="flex flex-col h-full bg-black/40">
                      <div className="p-3 border-b border-white/10 text-xs tracking-[0.3em]">
                        LIVE CHAT
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`text-xs ${
                              msg.user === "you"
                                ? "text-indigo-300 text-right"
                                : "text-white/70"
                            }`}
                          >
                            <span className="opacity-50 mr-1">
                              {msg.user}:
                            </span>
                            {msg.text}
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t border-white/10 flex gap-2">
                        <input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1 bg-black/50 text-xs p-2 rounded-md border border-white/10"
                          placeholder="Say something..."
                        />
                        <button
                          onClick={sendMessage}
                          className="text-xs px-3 py-2 bg-indigo-500/20 rounded-md"
                        >
                          SEND
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= MOBILE UI ================= */}
        {hideSidebars && (
          <>
            {/* MOBILE BOTTOM NAV */}
            <div className="fixed bottom-[70px] left-0 right-0 z-40 flex justify-center">
              <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl mx-3 px-2 py-2 flex justify-between">
                {mobileMainNav.map((item) => {
                  const href = navLinks[item];
                  const active = isActive(href);

                  return (
                    <Link
                      key={item}
                      href={href}
                      className={`text-[10px] tracking-[0.25em] px-2 py-1 rounded-md transition ${
                        active
                          ? "text-white bg-white/10"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}

                <button
                  onClick={() => setMobileMoreOpen(true)}
                  className="text-[10px] tracking-[0.25em] px-2 py-1 rounded-md text-white/50 hover:text-white transition"
                >
                  MORE
                </button>
              </div>
            </div>

            {/* MORE POPUP */}
            {mobileMoreOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
                <div className="w-full max-w-md bg-black border-t border-white/10 rounded-t-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] tracking-[0.3em] text-white/60">
                      MENU
                    </div>
                    <button onClick={() => setMobileMoreOpen(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {mobileMoreNav.map((item) => {
                      const href = navLinks[item];

                      return (
                        <Link
                          key={item}
                          href={href}
                          onClick={() => setMobileMoreOpen(false)}
                          className="flex items-center justify-center text-[10px] tracking-[0.2em] text-white/60 hover:text-white transition bg-white/5 border border-white/10 rounded-lg py-3 active:scale-[0.98]"
                        >
                          {item}
                        </Link>
                      );
                    })}

                    {/* ✅ MOBILE LOGIN */}
                    {!isSignedIn ? (
                      <SignInButton appearance={{elements:{logoBox: {display:"none", footer: {display:"none"}}}}} mode="modal">
                        <button
                          onClick={() => setMobileMoreOpen(false)}
                          className="flex items-center justify-center text-[10px] tracking-[0.2em] text-indigo-300 hover:text-white transition bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-3 active:scale-[0.98] col-span-2"
                        >
                          LOGIN
                        </button>
                      </SignInButton>
                    ) : (
                      <div className="col-span-2 flex justify-center">
                        <UserButton />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE CHAT BUTTON */}
            {isSignedIn && (
              <button
                onClick={() => setMobileChatOpen(true)}
                className="fixed bottom-28 right-4 z-50 w-12 h-12 rounded-full bg-indigo-500/30 backdrop-blur-xl border border-white/10 flex items-center justify-center"
              >
                <User className="w-5 h-5 text-white" />
              </button>
            )}

            {/* MOBILE CHAT PANEL */}
            {mobileChatOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
                <div className="w-full max-w-md h-[70%] bg-black border-t border-white/10 rounded-t-2xl flex flex-col">
                  <div className="p-3 flex justify-between items-center border-b border-white/10">
                    <div className="text-[10px] tracking-[0.3em]">
                      LIVE CHAT
                    </div>
                    <button onClick={() => setMobileChatOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`text-xs ${
                          msg.user === "you"
                            ? "text-indigo-300 text-right"
                            : "text-white/70"
                        }`}
                      >
                        <span className="opacity-50 mr-1">{msg.user}:</span>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-white/10 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1 bg-black/50 text-xs p-2 rounded-md border border-white/10"
                      placeholder="Say something..."
                    />
                    <button className="text-xs px-3 py-2 bg-indigo-500/20 rounded-md">
                      SEND
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE MUSIC PLAYER */}
            <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
              <div className="w-full max-w-5xl">
                <MusicPlayer />
              </div>
            </div>
          </>
        )}
      </div>
    </MusicProvider>
  );
}