"use client";







import {







  ReactNode,







  useEffect,







  useRef,







  useState,







} from "react";







import Link from "next/link";







import { usePathname } from "next/navigation";







import { useQuery } from "convex/react";







import { api } from "@/convex/_generated/api";







import {







  Flame,







  Headphones,







  LayoutDashboard,







  MessageCircle,







  PanelRightClose,







  PanelRightOpen,







  Send,







  User,







  X,







} from "lucide-react";







import {







  SignInButton,







  UserButton,







  useUser,







} from "@clerk/nextjs";







import LeftSidebar from "@/components/LeftSidebar";







import RightSidebar from "@/components/RightSidebar";







import MusicPlayer from "@/components/mobileUI/MusicPlayer";







import { MusicProvider } from "@/hooks/MusicContext";







// =========================================================







// NAVIGATION







// =========================================================







const mobilePrimaryNav = [







  {







    label: "HOME",







    href: "/",







  },







  {







    label: "MUSIC",







    href: "/music",







  },







  {







    label: "VIDEOS",







    href: "/videos",







  },







  {







    label: "TOUR",







    href: "/tour",







  },







];







const mobileMoreNav = [







  {







    label: "SHOP",







    href: "/shop",







  },







  {







    label: "ABOUT",







    href: "/about",







  },







  {







    label: "LIVE",







    href: "/live",







  },







  {







    label: "CONTACT",







    href: "/contact",







  },







];







// =========================================================







// TYPES







// =========================================================







type ChatMessage = {







  user: string;







  text: string;







};







// =========================================================







// LAYOUT







// =========================================================







export default function ClientLayout({







  children,







}: {







  children: ReactNode;







}) {







  const pathname =







    usePathname();







  const [







    hideSidebars,







    setHideSidebars,







  ] = useState(false);







  useEffect(() => {







    const media = window.matchMedia(







      "(max-width: 767px)"







    );







    const syncMobile = () => {







      setHideSidebars(media.matches);







    };







    syncMobile();







    media.addEventListener(







      "change",







      syncMobile







    );







    return () => {







      media.removeEventListener(







        "change",







        syncMobile







      );







    };







  }, []);







  const {







    isSignedIn,







  } = useUser();







  // ======================================================







  // DASHBOARD ACCESS







  // ======================================================







  const currentUser = useQuery(







    api.users.getCurrentUser,







    isSignedIn ? {} : "skip"







  );







  const memberships = useQuery(







    api.artists.access.getMyArtistMemberships,







    isSignedIn ? {} : "skip"







  );







  const dashboardHref =







    currentUser?.platformRole === "admin"







      ? "/admin"







      : memberships && memberships.length > 0







        ? "/artist-dashboard"







        : null;







  // ======================================================







  // STATE







  // ======================================================







  const [







    mobileChatOpen,







    setMobileChatOpen,







  ] = useState(false);







  const [







    mobileMoreOpen,







    setMobileMoreOpen,







  ] = useState(false);







  const [







    rightOpen,







    setRightOpen,







  ] = useState(false);







  const [







    leftOpen,







    setLeftOpen,







  ] = useState(true);







  const [







    isTightDesktop,







    setIsTightDesktop,







  ] = useState(false);







  const isWorkspaceRoute =







    pathname.startsWith("/admin") ||







    pathname.startsWith("/artist-dashboard") ||







    pathname.startsWith("/post-sign-in");







  const hideWorkspaceSidebars = isWorkspaceRoute;







  useEffect(() => {







    const media = window.matchMedia(







      "(max-width: 1439px)"







    );







    const syncDesktopWidth = () => {







      setIsTightDesktop(media.matches);







      if (!media.matches) {







        setLeftOpen(true);







      } else if (rightOpen) {







        setLeftOpen(false);







      }







    };







    syncDesktopWidth();







    media.addEventListener(







      "change",







      syncDesktopWidth







    );







    return () => {







      media.removeEventListener(







        "change",







        syncDesktopWidth







      );







    };







  }, [rightOpen]);







  const handleRightToggle = () => {







    setRightOpen(previous => {







      const next = !previous;







      if (isTightDesktop) {







        setLeftOpen(!next);







      }







      return next;







    });







  };







  const [







    chatInput,







    setChatInput,







  ] = useState("");







  const [







    messages,







    setMessages,







  ] = useState<ChatMessage[]>([







    {







      user: "system",







      text: "Welcome to the live chat 🔥",







    },







  ]);







  // ======================================================







  // MAIN SCROLL CONTAINER







  // ======================================================







  const scrollContainerRef =







    useRef<HTMLDivElement>(







      null







    );







  // Scroll the content area back to the top whenever







  // navigating to a different route.







  useEffect(() => {







    scrollContainerRef.current?.scrollTo({







      top: 0,







      behavior: "auto",







    });







  }, [pathname]);







  // ======================================================







  // ACTIVE ROUTE







  // ======================================================







  const isActiveRoute = (







    href: string







  ) => {







    if (href === "/") {







      return pathname === "/";







    }







    return (







      pathname === href ||







      pathname.startsWith(







        `${href}/`







      )







    );







  };







  // ======================================================







  // CHAT







  // ======================================================







  const sendMessage = () => {







    const message =







      chatInput.trim();







    if (!message) {







      return;







    }







    setMessages(







      previous => [







        ...previous,







        {







          user: "you",







          text: message,







        },







      ]







    );







    setChatInput("");







  };







  // ======================================================







  // UI







  // ======================================================







  return (







    <MusicProvider>







      <div







        className="







          fixed







          inset-0







          flex







          h-[100dvh]







          max-h-[100dvh]







          w-full







          flex-col







          overflow-hidden







          overscroll-none







          bg-[#15171c]







          text-white







        "







      >







        {/* ==================================================







            DESKTOP / APPLICATION SHELL







        \\\\\\\\\\\\\\\\================================================== */}







        <div







          className="







            flex







            min-h-0







            flex-1







          "







        >







          {/* ==================================================







              LEFT MUSIC SIDEBAR







          \\\\\\\\\\\\\\\\================================================== */}







          {!hideSidebars &&







            !hideWorkspaceSidebars && (







              <div







                className={`







                  shrink-0







                  overflow-hidden







                  transition-[width,opacity]







                  duration-300







                  ${







                    leftOpen







                      ? "w-auto opacity-100"







                      : "w-0 opacity-0"







                  }







                `}







              >







                <LeftSidebar
                isSignedIn={Boolean(isSignedIn)}
                dashboardHref={dashboardHref}
              />







              </div>







            )}







          {/* ==================================================







              CENTER APPLICATION







          \\\\\\\\\\\\\\\\================================================== */}







          <div







            className="







              flex







              min-w-0







              min-h-0







              flex-1







              flex-col







              bg-[#15171c]







            "







          >







            {/* ==================================================







                CONTENT + RIGHT SIDEBAR







            \\\\\\\\\\\\\\\\================================================== */}







            <div







              className="







                flex







                min-h-0







                min-w-0







                flex-1







              "







            >







              {/* ==============================================







                  ONLY MAIN PAGE SCROLLER







              \\\\\\\\\\\\\\\\============================================== */}







              <main







                ref={







                  scrollContainerRef







                }







                className="







                  min-h-0







                  min-w-0







                  flex-1







                  overflow-x-hidden







                  overflow-y-auto







                  overscroll-contain







                  bg-[#15171c]







                  [scrollbar-color:rgba(255,255,255,0.15)_transparent]







                  [scrollbar-width:thin]







                "







              >







                <div







                  className="







                    min-h-full







                  "







                >







                  {children}







                </div>







              </main>







              {/* ==============================================







                  DESKTOP RIGHT PANEL







              \\\\\\\\\\\\\\\\============================================== */}







              {!hideSidebars &&







                !hideWorkspaceSidebars && (







                <DesktopRightPanel







                  open={







                    rightOpen







                  }







                  onToggle={







                    handleRightToggle







                  }







                  isSignedIn={







                    Boolean(







                      isSignedIn







                    )







                  }







                  messages={







                    messages







                  }







                  chatInput={







                    chatInput







                  }







                  setChatInput={







                    setChatInput







                  }







                  sendMessage={







                    sendMessage







                  }







                />







              )}







            </div>







          </div>







        </div>







        {/* ==================================================







            MOBILE UI







        \\\\\\\\\\\\\\\\================================================== */}







        {hideSidebars && !hideWorkspaceSidebars && (







          <>







            {/* ==============================================







                MOBILE BOTTOM NAV







            \\\\\\\\\\\\\\\\============================================== */}







            <div







              className="







                pointer-events-none







                fixed







                bottom-[78px]







                left-0







                right-0







                z-20







                flex







                justify-center







                px-3







              "







            >







              <div







                className="







                  pointer-events-auto







                  flex







                  w-full







                  max-w-md







                  items-center







                  justify-between







                  rounded-2xl







                  border







                  border-white/[0.105]







                  bg-[#1d1f26]/92







                  p-1.5







                  shadow-2xl







                  shadow-black/60







                  backdrop-blur-2xl







                "







              >







                {mobilePrimaryNav.map(







                  item => (







                    <MobileNavLink







                      key={







                        item.href







                      }







                      href={







                        item.href







                      }







                      active={isActiveRoute(







                        item.href







                      )}







                    >







                      {item.label}







                    </MobileNavLink>







                  )







                )}







                <button







                  onClick={() =>







                    setMobileMoreOpen(







                      true







                    )







                  }







                  className="







                    rounded-xl







                    px-2.5







                    py-2







                    text-[9px]







                    font-medium







                    tracking-[0.17em]







                    text-white/50







                    transition







                    hover:bg-white/[0.065]







                    hover:text-white







                    active:scale-[0.97]







                  "







                >







                  MORE







                </button>







              </div>







            </div>







            {/* ==============================================







                MOBILE MORE SHEET







            \\\\\\\\\\\\\\\\============================================== */}







            {mobileMoreOpen && (







              <div







                className="







                  fixed







                  inset-0







                  z-50







                  flex







                  items-end







                  justify-center







                  bg-black/70







                  backdrop-blur-sm







                "







                onClick={() =>







                  setMobileMoreOpen(







                    false







                  )







                }







              >







                <div







                  className="







                    w-full







                    max-w-md







                    rounded-t-[28px]







                    border







                    border-white/[0.105]







                    bg-[#1c1e24]







                    p-5







                    shadow-2xl







                    shadow-black







                  "







                  onClick={







                    event =>







                      event.stopPropagation()







                  }







                >







                  {/* HEADER */}







                  <div







                    className="







                      flex







                      items-center







                      justify-between







                    "







                  >







                    <div>







                      <p







                        className="







                          text-[10px]







                          font-medium







                          uppercase







                          tracking-[0.22em]







                          text-white/46







                        "







                      >







                        Navigation







                      </p>







                      <h2







                        className="







                          mt-1







                          text-lg







                          font-semibold







                        "







                      >







                        More







                      </h2>







                    </div>







                    <button







                      onClick={() =>







                        setMobileMoreOpen(







                          false







                        )







                      }







                      className="







                        flex







                        h-9







                        w-9







                        items-center







                        justify-center







                        rounded-full







                        border







                        border-white/[0.105]







                        bg-white/[0.055]







                        text-white/50







                        transition







                        hover:bg-white/[0.095]







                        hover:text-white







                      "







                    >







                      <X







                        size={16}







                      />







                    </button>







                  </div>







                  {/* LINKS */}







                  <div







                    className="







                      mt-6







                      grid







                      grid-cols-2







                      gap-2







                    "







                  >







                    {mobileMoreNav.map(







                      item => (







                        <Link







                          key={







                            item.href







                          }







                          href={







                            item.href







                          }







                          onClick={() =>







                            setMobileMoreOpen(







                              false







                            )







                          }







                          className={`







                            flex







                            min-h-[54px]







                            items-center







                            justify-center







                            rounded-xl







                            border







                            text-[10px]







                            font-medium







                            tracking-[0.16em]







                            transition







                            active:scale-[0.98]







                            ${







                              isActiveRoute(







                                item.href







                              )







                                ? `







                                  border-violet-400/25







                                  bg-violet-500/[0.08]







                                  text-violet-100







                                `







                                : `







                                  border-white/[0.095]







                                  bg-white/[0.045]







                                  text-white/45







                                  hover:bg-white/[0.065]







                                  hover:text-white







                                `







                            }







                          `}







                        >







                          {







                            item.label







                          }







                        </Link>







                      )







                    )}







                  </div>







                  {/* AUTH */}







                  <div







                    className="







                      mt-4







                      border-t







                      border-white/[0.095]







                      pt-4







                    "







                  >







                    {!isSignedIn ? (







                      <SignInButton







                        mode="modal"







                        appearance={{







                          elements: {







                            logoBox: {







                              display:







                                "none",







                            },







                            footer: {







                              display:







                                "none",







                            },







                          },







                        }}







                      >







                        <button







                          onClick={() =>







                            setMobileMoreOpen(







                              false







                            )







                          }







                          className="







                            flex







                            h-12







                            w-full







                            items-center







                            justify-center







                            rounded-xl







                            border







                            border-violet-400/20







                            bg-violet-500/[0.07]







                            text-xs







                            font-medium







                            text-violet-100







                            transition







                            hover:bg-violet-500/[0.12]







                          "







                        >







                          LOGIN







                        </button>







                      </SignInButton>







                    ) : (







                      <div className="space-y-2">







                        {dashboardHref && (







                          <Link







                            href={dashboardHref}







                            onClick={() => setMobileMoreOpen(false)}







                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] text-xs font-medium tracking-[0.12em] text-violet-100 transition hover:bg-violet-500/[0.12]"







                          >







                            <LayoutDashboard size={15} />







                            DASHBOARD







                          </Link>







                        )}







                        <div







                        className="







                          flex







                          items-center







                          justify-between







                          rounded-xl







                          border







                          border-white/[0.095]







                          bg-white/[0.045]







                          px-4







                          py-3







                        "







                      >







                        <span







                          className="







                            text-xs







                            text-white/50







                          "







                        >







                          Signed in







                        </span>







                        <UserButton />







                      </div>







                      </div>







                    )}







                  </div>







                </div>







              </div>







            )}







            {/* ==============================================







                MOBILE CHAT BUTTON







            \\\\\\\\\\\\\\\\============================================== */}







            {isSignedIn && (







              <button







                onClick={() =>







                  setMobileChatOpen(







                    true







                  )







                }







                className="







                  fixed







                  bottom-32







                  right-4







                  z-40







                  flex







                  h-11







                  w-11







                  items-center







                  justify-center







                  rounded-full







                  border







                  border-violet-400/20







                  bg-[#22242b]/92







                  text-violet-200







                  shadow-xl







                  shadow-black/50







                  backdrop-blur-xl







                  transition







                  hover:border-violet-400/35







                  hover:bg-violet-500/[0.10]







                  active:scale-95







                "







              >







                <MessageCircle







                  size={18}







                />







              </button>







            )}







            {/* ==============================================







                MOBILE CHAT PANEL







            \\\\\\\\\\\\\\\\============================================== */}







            {mobileChatOpen && (







              <div







                className="







                  fixed







                  inset-0







                  z-50







                  flex







                  items-end







                  justify-center







                  bg-black/70







                  backdrop-blur-sm







                "







                onClick={() =>







                  setMobileChatOpen(







                    false







                  )







                }







              >







                <div







                  className="







                    flex







                    h-[72%]







                    w-full







                    max-w-md







                    flex-col







                    overflow-hidden







                    rounded-t-[28px]







                    border







                    border-white/[0.105]







                    bg-[#1b1d23]







                    shadow-2xl







                    shadow-black







                  "







                  onClick={







                    event =>







                      event.stopPropagation()







                  }







                >







                  {/* HEADER */}







                  <div







                    className="







                      flex







                      shrink-0







                      items-center







                      justify-between







                      border-b







                      border-white/[0.095]







                      px-4







                      py-4







                    "







                  >







                    <div







                      className="







                        flex







                        items-center







                        gap-3







                      "







                    >







                      <div







                        className="







                          flex







                          h-9







                          w-9







                          items-center







                          justify-center







                          rounded-xl







                          border







                          border-violet-400/20







                          bg-violet-500/[0.06]







                          text-violet-200







                        "







                      >







                        <MessageCircle







                          size={16}







                        />







                      </div>







                      <div>







                        <p







                          className="







                            text-sm







                            font-medium







                          "







                        >







                          Live Chat







                        </p>







                        <p







                          className="







                            text-[10px]







                            text-white/42







                          "







                        >







                          SOA community







                        </p>







                      </div>







                    </div>







                    <button







                      onClick={() =>







                        setMobileChatOpen(







                          false







                        )







                      }







                      className="







                        flex







                        h-9







                        w-9







                        items-center







                        justify-center







                        rounded-full







                        text-white/50







                        transition







                        hover:bg-white/[0.065]







                        hover:text-white







                      "







                    >







                      <X







                        size={17}







                      />







                    </button>







                  </div>







                  {/* MESSAGES */}







                  <ChatMessages







                    messages={







                      messages







                    }







                  />







                  {/* INPUT */}







                  <ChatInput







                    value={







                      chatInput







                    }







                    setValue={







                      setChatInput







                    }







                    onSend={







                      sendMessage







                    }







                  />







                </div>







              </div>







            )}







            {/* ==============================================







                MOBILE MUSIC PLAYER







            \\\\\\\\\\\\\\\\============================================== */}







            <div







              className="







                fixed







                bottom-0







                left-0







                right-0







                z-30







                flex







                justify-center







              "







            >







              <div







                className="







                  w-full







                  max-w-5xl







                "







              >







                <MusicPlayer />







              </div>







            </div>







          </>







        )}







      </div>







    </MusicProvider>







  );







}







// =========================================================







// DESKTOP HEADER







// =========================================================



// DESKTOP APP UTILITIES



// =========================================================







// DESKTOP RIGHT PANEL







// =========================================================







function DesktopRightPanel({







  open,







  onToggle,







  isSignedIn,







  messages,







  chatInput,







  setChatInput,







  sendMessage,







}: {







  open: boolean;







  onToggle: () => void;







  isSignedIn: boolean;







  messages: ChatMessage[];







  chatInput: string;







  setChatInput: (







    value: string







  ) => void;







  sendMessage: () => void;







}) {







  return (







    <aside







      className={`







        relative







        shrink-0







        border-l







        border-white/[0.085]







        bg-[#181a20]







        transition-[width]







        duration-300







        ${







          open







            ? "w-[280px]"







            : "w-[62px]"







        }







      `}







    >







      {/* ==================================================







          TOGGLE







      \\\\\\\\\\\\\\\\================================================== */}







      <button







        onClick={







          onToggle







        }







        className="







          absolute







          -left-3







          top-5







          z-20







          flex







          h-7







          w-7







          items-center







          justify-center







          rounded-full







          border







          border-white/[0.105]







          bg-[#24262d]







          text-white/50







          shadow-lg







          shadow-black/40







          transition







          hover:border-violet-400/25







          hover:bg-violet-500/[0.07]







          hover:text-white







        "







      >







        {open ? (







          <PanelRightClose







            size={13}







          />







        ) : (







          <PanelRightOpen







            size={13}







          />







        )}







      </button>







      {/* ==================================================







          COLLAPSED







      \\\\\\\\\\\\\\\\================================================== */}







      {!open && (







        <div







          className="







            flex







            h-full







            flex-col







            items-center







            gap-3







            px-2







            pt-16







          "







        >







          <CollapsedIcon>







            <MessageCircle







              size={15}







            />







          </CollapsedIcon>







          <CollapsedIcon>







            <Flame







              size={15}







            />







          </CollapsedIcon>







          <CollapsedIcon>







            <Headphones







              size={15}







            />







          </CollapsedIcon>







        </div>







      )}







      {/* ==================================================







          OPEN







      \\\\\\\\\\\\\\\\================================================== */}







      {open && (







        <div







          className="







            flex







            h-full







            min-h-0







            flex-col







            overflow-hidden







          "







        >







          {!isSignedIn ? (







            <RightSidebar />







          ) : (







            <>







              {/* ==============================================







                  CHAT HEADER







              \\\\\\\\\\\\\\\\============================================== */}







              <div







                className="







                  flex







                  shrink-0







                  items-center







                  justify-between







                  border-b







                  border-white/[0.085]







                  px-4







                  py-4







                "







              >







                <div







                  className="







                    flex







                    items-center







                    gap-3







                  "







                >







                  <div







                    className="







                      flex







                      h-9







                      w-9







                      items-center







                      justify-center







                      rounded-xl







                      border







                      border-violet-400/15







                      bg-violet-500/[0.05]







                      text-violet-200/70







                    "







                  >







                    <MessageCircle







                      size={15}







                    />







                  </div>







                  <div>







                    <p







                      className="







                        text-xs







                        font-semibold







                      "







                    >







                      Live Chat







                    </p>







                    <p







                      className="







                        mt-0.5







                        text-[10px]







                        text-white/36







                      "







                    >







                      SOA community







                    </p>







                  </div>







                </div>







                <span







                  className="







                    flex







                    items-center







                    gap-1.5







                    text-[9px]







                    uppercase







                    tracking-[0.14em]







                    text-white/36







                  "







                >







                  <span







                    className="







                      h-1.5







                      w-1.5







                      rounded-full







                      bg-emerald-400







                    "







                  />







                  Live







                </span>







              </div>







              {/* ==============================================







                  MESSAGES







              \\\\\\\\\\\\\\\\============================================== */}







              <ChatMessages







                messages={







                  messages







                }







              />







              {/* ==============================================







                  INPUT







              \\\\\\\\\\\\\\\\============================================== */}







              <ChatInput







                value={







                  chatInput







                }







                setValue={







                  setChatInput







                }







                onSend={







                  sendMessage







                }







              />







            </>







          )}







        </div>







      )}







    </aside>







  );







}







// =========================================================







// CHAT MESSAGES







// =========================================================







function ChatMessages({







  messages,







}: {







  messages: ChatMessage[];







}) {







  return (







    <div







      className="







        min-h-0







        flex-1







        space-y-2







        overflow-y-auto







        p-3







        [scrollbar-color:rgba(255,255,255,0.10)_transparent]







        [scrollbar-width:thin]







      "







    >







      {messages.map(







        (







          message,







          index







        ) => {







          const mine =







            message.user ===







            "you";







          return (







            <div







              key={







                index







              }







              className={`







                flex







                ${







                  mine







                    ? "justify-end"







                    : "justify-start"







                }







              `}







            >







              <div







                className={`







                  max-w-[88%]







                  rounded-xl







                  border







                  px-3







                  py-2







                  text-xs







                  leading-5







                  ${







                    mine







                      ? `







                        border-violet-400/15







                        bg-violet-500/[0.07]







                        text-violet-50/80







                      `







                      : `







                        border-white/[0.085]







                        bg-white/[0.045]







                        text-white/65







                      `







                  }







                `}







              >







                {message.user !==







                  "you" && (







                  <p







                    className="







                      mb-0.5







                      text-[9px]







                      uppercase







                      tracking-[0.10em]







                      text-white/36







                    "







                  >







                    {







                      message.user







                    }







                  </p>







                )}







                {







                  message.text







                }







              </div>







            </div>







          );







        }







      )}







    </div>







  );







}







// =========================================================







// CHAT INPUT







// =========================================================







function ChatInput({







  value,







  setValue,







  onSend,







}: {







  value: string;







  setValue: (







    value: string







  ) => void;







  onSend: () => void;







}) {







  return (







    <div







      className="







        shrink-0







        border-t







        border-white/[0.085]







        p-3







      "







    >







      <div







        className="







          flex







          items-center







          gap-2







          rounded-xl







          border







          border-white/[0.095]







          bg-white/[0.045]







          p-1.5







          transition







          focus-within:border-violet-400/20







          focus-within:bg-violet-500/[0.025]







        "







      >







        <input







          value={







            value







          }







          onChange={







            event =>







              setValue(







                event.target.value







              )







          }







          onKeyDown={







            event => {







              if (







                event.key ===







                "Enter"







              ) {







                onSend();







              }







            }







          }







          placeholder="Say something..."







          className="







            min-w-0







            flex-1







            bg-transparent







            px-2







            text-xs







            text-white







            outline-none







            placeholder:text-white/20







          "







        />







        <button







          onClick={







            onSend







          }







          disabled={







            !value.trim()







          }







          className="







            flex







            h-8







            w-8







            shrink-0







            items-center







            justify-center







            rounded-lg







            bg-violet-500/[0.10]







            text-violet-200/70







            transition







            hover:bg-violet-500/[0.18]







            hover:text-white







            disabled:cursor-not-allowed







            disabled:opacity-30







          "







        >







          <Send







            size={13}







          />







        </button>







      </div>







    </div>







  );







}







// =========================================================







// COLLAPSED ICON







// =========================================================







function CollapsedIcon({







  children,







}: {







  children: ReactNode;







}) {







  return (







    <div







      className="







        flex







        h-9







        w-9







        items-center







        justify-center







        rounded-xl







        border







        border-white/[0.085]







        bg-white/[0.045]







        text-white/42







      "







    >







      {children}







    </div>







  );







}







// =========================================================







// MOBILE NAV LINK







// =========================================================







function MobileNavLink({







  href,







  active,







  children,







}: {







  href: string;







  active: boolean;







  children: ReactNode;







}) {







  return (







    <Link







      href={







        href







      }







      className={`







        relative







        rounded-xl







        px-2.5







        py-2







        text-[9px]







        font-medium







        tracking-[0.17em]







        transition







        active:scale-[0.97]







        ${







          active







            ? `







              bg-white/[0.085]







              text-white







            `







            : `







              text-white/50







              hover:bg-white/[0.055]







              hover:text-white/80







            `







        }







      `}







    >







      {children}







      {active && (







        <span







          className="







            absolute







            bottom-0.5







            left-1/2







            h-px







            w-3







            -translate-x-1/2







            bg-violet-300







            shadow-[0_0_6px_rgba(196,181,253,0.8)]







          "







        />







      )}







    </Link>







  );







}
