"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  SignInButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";

import {
  useMutation,
  useQuery,
} from "convex/react";

import {
  Activity,
  AtSign,
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Compass,
  Eye,
  Flame,
  Globe2,
  Headphones,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Music2,
  Palette,
  Radio,
  RefreshCw,
  Save,
  Shield,
  SlidersHorizontal,
  Sparkles,
  User,
  Volume2,
  Zap,
} from "lucide-react";

import { api } from "@/convex/_generated/api";

// =========================================================
// TYPES
// =========================================================

type SettingsSection =
  | "profile"
  | "listening"
  | "discovery"
  | "notifications"
  | "privacy"
  | "account";

type PreferenceState = {
  autoplay: boolean;
  rememberVolume: boolean;
  normalizeVolume: boolean;
  reducedMotion: boolean;

  personalizedDiscovery: boolean;
  listeningHistoryRecommendations: boolean;
  newReleaseRecommendations: boolean;
  surfaceFamiliarMusic: boolean;

  newReleaseNotifications: boolean;
  artistNotifications: boolean;
  liveNotifications: boolean;
  productNotifications: boolean;

  publicProfile: boolean;
  showListeningActivity: boolean;
  showPlaylists: boolean;
  showCountry: boolean;

  audioQuality:
    | "auto"
    | "high"
    | "max";

  discoveryStyle:
    | "balanced"
    | "familiar"
    | "adventurous";
};

// =========================================================
// CONSTANTS
// =========================================================

const STORAGE_KEY =
  "soa-listener-preferences-v1";

const DEFAULT_PREFERENCES: PreferenceState = {
  autoplay: true,
  rememberVolume: true,
  normalizeVolume: false,
  reducedMotion: false,

  personalizedDiscovery: true,
  listeningHistoryRecommendations: true,
  newReleaseRecommendations: true,
  surfaceFamiliarMusic: true,

  newReleaseNotifications: true,
  artistNotifications: true,
  liveNotifications: true,
  productNotifications: false,

  publicProfile: true,
  showListeningActivity: true,
  showPlaylists: true,
  showCountry: true,

  audioQuality: "auto",

  discoveryStyle:
    "balanced",
};

const avatarOptions = [
  "🌙",
  "🔥",
  "🧊",
  "⚡",
  "🌌",
  "🎧",
  "🌀",
  "👾",
  "💿",
  "🖤",
  "🪩",
  "🛸",
];

const countryCodes = [
  "US",
  "CA",
  "MX",
  "BR",
  "AR",
  "CO",
  "GB",
  "FR",
  "DE",
  "IT",
  "ES",
  "PT",
  "NL",
  "BE",
  "CH",
  "AT",
  "SE",
  "NO",
  "DK",
  "FI",
  "PL",
  "CZ",
  "GR",
  "IE",
  "UA",
  "TR",
  "AE",
  "SA",
  "QA",
  "KW",
  "IL",
  "EG",
  "MA",
  "NG",
  "ZA",
  "KE",
  "IN",
  "PK",
  "BD",
  "JP",
  "KR",
  "CN",
  "SG",
  "MY",
  "ID",
  "PH",
  "TH",
  "VN",
  "AU",
  "NZ",
];

// =========================================================
// PAGE
// =========================================================

export default function Profile() {
  const {
    user,
    isLoaded,
    isSignedIn,
  } = useUser();

  const {
    openUserProfile,
  } = useClerk();

  // ======================================================
  // DATABASE USER
  // ======================================================

  const dbUser =
    useQuery(
      api.users.getByClerkId,

      user?.id
        ? {
            clerkId:
              user.id,
          }
        : "skip"
    );

  const updateUser =
    useMutation(
      api.users.updateProfile
    );

  // ======================================================
  // ACTIVE SECTION
  // ======================================================

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<SettingsSection>(
      "profile"
    );

  // ======================================================
  // PROFILE STATE
  // ======================================================

  const [
    name,
    setName,
  ] = useState("");

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    avatar,
    setAvatar,
  ] = useState("🌙");

  const [
    flag,
    setFlag,
  ] = useState("US");

  const [
    profileStatus,
    setProfileStatus,
  ] = useState<
    | "idle"
    | "saving"
    | "saved"
    | "error"
  >("idle");

  // ======================================================
  // LOCAL LISTENER PREFERENCES
  // ======================================================

  const [
    preferences,
    setPreferences,
  ] =
    useState<PreferenceState>(
      DEFAULT_PREFERENCES
    );

  const [
    preferencesHydrated,
    setPreferencesHydrated,
  ] = useState(false);

  // ======================================================
  // SYNC DATABASE USER → PROFILE UI
  // ======================================================

  useEffect(() => {
    if (!dbUser) {
      return;
    }

    setName(
      dbUser.displayName ??
        ""
    );

    setUsername(
      dbUser.username ??
        ""
    );

    setAvatar(
      dbUser.avatar ??
        "🌙"
    );

    setFlag(
      dbUser.countryCode ??
        "US"
    );
  }, [dbUser]);

  // ======================================================
  // LOAD DEVICE SETTINGS
  // ======================================================

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        const parsed =
          JSON.parse(stored);

        setPreferences(
          previous => ({
            ...previous,
            ...parsed,
          })
        );
      }
    } catch {
      // Ignore malformed or unavailable local storage.
    }

    setPreferencesHydrated(
      true
    );
  }, []);

  // ======================================================
  // SAVE DEVICE SETTINGS
  // ======================================================

  useEffect(() => {
    if (
      !preferencesHydrated
    ) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          preferences
        )
      );
    } catch {
      // Ignore storage failures.
    }
  }, [
    preferences,
    preferencesHydrated,
  ]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const saveProfile =
    async () => {
      if (!user?.id) {
        return;
      }

      const cleanName =
        name.trim();

      const cleanUsername =
        username
          .trim()
          .replace(
            /^@/,
            ""
          );

      if (
        !cleanName ||
        !cleanUsername
      ) {
        setProfileStatus(
          "error"
        );

        return;
      }

      try {
        setProfileStatus(
          "saving"
        );

        await updateUser({
          clerkId:
            user.id,

          displayName:
            cleanName,

          username:
            cleanUsername,

          avatar,

          countryCode:
            flag,
        });

        setName(
          cleanName
        );

        setUsername(
          cleanUsername
        );

        setProfileStatus(
          "saved"
        );

        window.setTimeout(
          () => {
            setProfileStatus(
              "idle"
            );
          },
          1800
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to save profile:",
          error
        );

        setProfileStatus(
          "error"
        );
      }
    };

  // ======================================================
  // UPDATE PREFERENCE
  // ======================================================

  const setPreference = <
    K extends keyof PreferenceState,
  >(
    key: K,
    value: PreferenceState[K]
  ) => {
    setPreferences(
      previous => ({
        ...previous,
        [key]: value,
      })
    );
  };

  // ======================================================
  // RESET PREFERENCES
  // ======================================================

  const resetPreferences =
    () => {
      setPreferences(
        DEFAULT_PREFERENCES
      );
    };

  // ======================================================
  // REAL LISTENER METRICS
  // ======================================================

  const listenerMetrics =
    useMemo(() => {
      if (!dbUser) {
        return [];
      }

      return [
        {
          label:
            "Listening time",

          value:
            formatListeningTime(
              dbUser.totalListeningTime ??
                0
            ),

          icon: Clock3,
        },

        {
          label:
            "Tracks played",

          value:
            formatNumber(
              dbUser.totalPlays ??
                0
            ),

          icon: Music2,
        },

        {
          label:
            "Replays",

          value:
            formatNumber(
              dbUser.totalReplays ??
                0
            ),

          icon: RefreshCw,
        },

        {
          label:
            "Listening streak",

          value:
            `${dbUser.streakDays ?? 0}d`,

          icon: Flame,
        },
      ];
    }, [dbUser]);

  // ======================================================
  // LOADING
  // ======================================================

  if (!isLoaded) {
    return (
      <PageLoading />
    );
  }

  // ======================================================
  // SIGNED OUT
  // ======================================================

  if (!isSignedIn) {
    return (
      <SignedOutState />
    );
  }

  // ======================================================
  // DB LOADING
  // ======================================================

  if (
    dbUser === undefined
  ) {
    return (
      <PageLoading />
    );
  }

  // ======================================================
  // USER SETUP DELAY
  // ======================================================

  if (!dbUser) {
    return (
      <AccountSetupState />
    );
  }

  // ======================================================
  // DISPLAY
  // ======================================================

  const displayName =
    name ||
    dbUser.displayName ||
    user.fullName ||
    "Listener";

  const displayUsername =
    username ||
    dbUser.username ||
    "listener";

  const plan =
    capitalize(
      dbUser.plan ??
        "free"
    );

  const engagement =
    formatEngagementLevel(
      dbUser.engagementLevel
    );

  const memberSince =
    new Date(
      dbUser.createdAt
    ).toLocaleDateString(
      undefined,
      {
        month: "short",
        year: "numeric",
      }
    );

  const favoriteArtistCount =
    dbUser.favoriteArtistIds
      ?.length ?? 0;

  const profileImage =
    isImageUrl(avatar)
      ? avatar
      : null;

  const signInEmail =
    user.primaryEmailAddress
      ?.emailAddress ??
    dbUser.email ??
    "Not available";

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        relative
        w-full
        bg-[#15171c]
        text-white
      "
    >
      {/* ==================================================
          PAGE AMBIENCE
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-white/[0.018]
            via-transparent
            to-black/10
          "
        />

        <div
          className="
            absolute
            -left-40
            -top-32
            h-[460px]
            w-[460px]
            rounded-full
            bg-blue-600/[0.045]
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            right-[-200px]
            top-[28%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.045]
            blur-[190px]
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            left-[30%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-purple-600/[0.035]
            blur-[180px]
          "
        />
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1450px]
          px-5
          pb-28
          pt-7
          sm:px-8
          lg:px-10
        "
      >
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <header
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                font-medium
                uppercase
                tracking-[0.20em]
                text-violet-200/40
              "
            >
              <SlidersHorizontal
                size={12}
              />

              Listener settings
            </div>

            <h1
              className="
                mt-2
                text-3xl
                font-bold
                tracking-[-0.045em]
                sm:text-4xl
              "
            >
              Your SOA.
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-white/48
              "
            >
              Shape how your
              profile, listening,
              discovery and privacy
              work across SOA Music.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-[10px]
              text-white/48
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-violet-300
                shadow-[0_0_8px_rgba(196,181,253,0.7)]
              "
            />

            Settings sync on this
            device
          </div>
        </header>

        {/* ==================================================
            LISTENER HERO
        ================================================== */}

        <section
          className="
            relative
            mt-7
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.09]
            bg-[#1b1e25]
          "
        >
          {/* BACKDROP */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
            "
          >
            <div
              className="
                absolute
                -left-16
                -top-20
                h-72
                w-72
                rounded-full
                bg-blue-500/[0.09]
                blur-[110px]
              "
            />

            <div
              className="
                absolute
                right-[-80px]
                top-[-100px]
                h-80
                w-80
                rounded-full
                bg-violet-600/[0.11]
                blur-[120px]
              "
            />

            <div
              className="
                absolute
                inset-0
                opacity-[0.025]
                [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
                [background-size:45px_45px]
              "
            />
          </div>

          <div
            className="
              relative
              z-10
              p-6
              sm:p-8
              lg:p-9
            "
          >
            <div
              className="
                flex
                flex-col
                gap-7
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* IDENTITY */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* AVATAR */}

                <div
                  className="
                    relative
                    shrink-0
                  "
                >
                  <div
                    className="
                      absolute
                      inset-2
                      rounded-[26px]
                      bg-gradient-to-br
                      from-blue-500/25
                      via-violet-500/25
                      to-purple-500/25
                      blur-2xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-violet-300/18
                      bg-[#20232b]
                      text-4xl
                      shadow-2xl
                      shadow-black/40
                    "
                  >
                    {profileImage ? (
                      <img
                        src={
                          profileImage
                        }
                        alt={
                          displayName
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      avatar
                    )}

                    {preferences.showCountry && (
                      <span
                        className="
                          absolute
                          bottom-2
                          right-2
                          text-lg
                          drop-shadow-lg
                        "
                      >
                        {getFlagEmoji(
                          flag
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* USER INFO */}

                <div>
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        rounded-full
                        border
                        border-violet-400/15
                        bg-violet-500/[0.05]
                        px-2.5
                        py-1
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.14em]
                        text-violet-100/50
                      "
                    >
                      {plan} listener
                    </span>

                    {dbUser.isVerified && (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          border
                          border-blue-400/12
                          bg-blue-500/[0.04]
                          px-2.5
                          py-1
                          text-[8px]
                          uppercase
                          tracking-[0.12em]
                          text-blue-100/45
                        "
                      >
                        <BadgeCheck
                          size={10}
                        />

                        Verified
                      </span>
                    )}
                  </div>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-bold
                      tracking-[-0.045em]
                      sm:text-4xl
                    "
                  >
                    {displayName}
                  </h2>

                  <div
                    className="
                      mt-2
                      flex
                      flex-wrap
                      items-center
                      gap-x-3
                      gap-y-1
                      text-xs
                      text-white/42
                    "
                  >
                    <span>
                      @{displayUsername}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {getFlagEmoji(
                        flag
                      )}{" "}
                      {flag}
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      Member since{" "}
                      {memberSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* LISTENER IDENTITY */}

              <div
                className="
                  min-w-[220px]
                  rounded-2xl
                  border
                  border-white/[0.085]
                  bg-black/20
                  p-4
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.16em]
                        text-white/48
                      "
                    >
                      Listening identity
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-lg
                        font-semibold
                      "
                    >
                      {engagement}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-violet-400/12
                      bg-violet-500/[0.04]
                      text-violet-200/45
                    "
                  >
                    <Activity
                      size={17}
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    text-[9px]
                    text-white/48
                  "
                >
                  <span>
                    Favorite artists
                  </span>

                  <span
                    className="
                      font-medium
                      text-white/55
                    "
                  >
                    {favoriteArtistCount}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                REAL LISTENER STATS
            ================================================== */}

            <div
              className="
                mt-8
                grid
                gap-px
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.10]
                bg-white/[0.075]
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              {listenerMetrics.map(
                metric => {
                  const Icon =
                    metric.icon;

                  return (
                    <div
                      key={
                        metric.label
                      }
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        bg-[#1a1d24]/95
                        px-5
                        py-4
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.12em]
                            text-white/32
                          "
                        >
                          {
                            metric.label
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xl
                            font-semibold
                            tracking-[-0.03em]
                          "
                        >
                          {
                            metric.value
                          }
                        </p>
                      </div>

                      <Icon
                        size={16}
                        className="text-violet-200/30"
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            SETTINGS WORKSPACE
        ================================================== */}

        <div
          className="
            mt-7
            grid
            gap-5
            lg:grid-cols-[230px_minmax(0,1fr)]
          "
        >
          {/* ==================================================
              SETTINGS NAV
          ================================================== */}

          <aside
            className="
              min-w-0
            "
          >
            {/* MOBILE NAV */}

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-2
                lg:hidden
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <MobileSettingsTab
                label="Profile"
                active={
                  activeSection ===
                  "profile"
                }
                onClick={() =>
                  setActiveSection(
                    "profile"
                  )
                }
              />

              <MobileSettingsTab
                label="Listening"
                active={
                  activeSection ===
                  "listening"
                }
                onClick={() =>
                  setActiveSection(
                    "listening"
                  )
                }
              />

              <MobileSettingsTab
                label="Discovery"
                active={
                  activeSection ===
                  "discovery"
                }
                onClick={() =>
                  setActiveSection(
                    "discovery"
                  )
                }
              />

              <MobileSettingsTab
                label="Alerts"
                active={
                  activeSection ===
                  "notifications"
                }
                onClick={() =>
                  setActiveSection(
                    "notifications"
                  )
                }
              />

              <MobileSettingsTab
                label="Privacy"
                active={
                  activeSection ===
                  "privacy"
                }
                onClick={() =>
                  setActiveSection(
                    "privacy"
                  )
                }
              />

              <MobileSettingsTab
                label="Account"
                active={
                  activeSection ===
                  "account"
                }
                onClick={() =>
                  setActiveSection(
                    "account"
                  )
                }
              />
            </div>

            {/* DESKTOP NAV */}

            <div
              className="
                hidden
                rounded-[22px]
                border
                border-white/[0.10]
                bg-[#1a1d23]
                p-2
                lg:block
                lg:sticky
                lg:top-5
              "
            >
              <SettingsNavButton
                icon={
                  <CircleUserRound
                    size={16}
                  />
                }
                title="Profile"
                description="Your identity"
                active={
                  activeSection ===
                  "profile"
                }
                onClick={() =>
                  setActiveSection(
                    "profile"
                  )
                }
              />

              <SettingsNavButton
                icon={
                  <Headphones
                    size={16}
                  />
                }
                title="Listening"
                description="Playback preferences"
                active={
                  activeSection ===
                  "listening"
                }
                onClick={() =>
                  setActiveSection(
                    "listening"
                  )
                }
              />

              <SettingsNavButton
                icon={
                  <Compass
                    size={16}
                  />
                }
                title="Discovery"
                description="Shape recommendations"
                active={
                  activeSection ===
                  "discovery"
                }
                onClick={() =>
                  setActiveSection(
                    "discovery"
                  )
                }
              />

              <SettingsNavButton
                icon={
                  <Bell
                    size={16}
                  />
                }
                title="Notifications"
                description="What reaches you"
                active={
                  activeSection ===
                  "notifications"
                }
                onClick={() =>
                  setActiveSection(
                    "notifications"
                  )
                }
              />

              <SettingsNavButton
                icon={
                  <Shield
                    size={16}
                  />
                }
                title="Privacy"
                description="Control visibility"
                active={
                  activeSection ===
                  "privacy"
                }
                onClick={() =>
                  setActiveSection(
                    "privacy"
                  )
                }
              />

              <SettingsNavButton
                icon={
                  <KeyRound
                    size={16}
                  />
                }
                title="Account"
                description="Login & security"
                active={
                  activeSection ===
                  "account"
                }
                onClick={() =>
                  setActiveSection(
                    "account"
                  )
                }
              />

              <div
                className="
                  mx-2
                  my-3
                  h-px
                  bg-white/[0.075]
                "
              />

              <button
                type="button"
                onClick={
                  resetPreferences
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  text-[10px]
                  text-white/48
                  transition
                  hover:bg-white/[0.065]
                  hover:text-white/55
                "
              >
                <RefreshCw
                  size={14}
                />

                Reset device settings
              </button>
            </div>
          </aside>

          {/* ==================================================
              SETTINGS PANEL
          ================================================== */}

          <div
            className="
              min-w-0
            "
          >
            {/* ==================================================
                PROFILE
            ================================================== */}

            {activeSection ===
              "profile" && (
              <SettingsPanel
                eyebrow="Listener identity"
                title="Profile"
                description="This is how you appear across SOA."
                icon={
                  <CircleUserRound
                    size={19}
                  />
                }
              >
                {/* AVATAR */}

                <div
                  className="
                    grid
                    gap-6
                    xl:grid-cols-[200px_minmax(0,1fr)]
                  "
                >
                  <div>
                    <SettingLabel>
                      Avatar
                    </SettingLabel>

                    <div
                      className="
                        mt-3
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-violet-400/15
                        bg-white/[0.045]
                        text-5xl
                      "
                    >
                      {profileImage ? (
                        <img
                          src={
                            profileImage
                          }
                          alt={
                            displayName
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        avatar
                      )}
                    </div>

                    <p
                      className="
                        mt-3
                        max-w-[170px]
                        text-[10px]
                        leading-5
                        text-white/48
                      "
                    >
                      Choose a listener
                      identity that feels
                      like you.
                    </p>
                  </div>

                  <div>
                    <SettingLabel>
                      Choose avatar
                    </SettingLabel>

                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-6
                        gap-2
                        sm:grid-cols-8
                        xl:grid-cols-12
                      "
                    >
                      {avatarOptions.map(
                        option => (
                          <button
                            key={
                              option
                            }
                            type="button"
                            onClick={() =>
                              setAvatar(
                                option
                              )
                            }
                            className={`
                              flex
                              aspect-square
                              items-center
                              justify-center
                              rounded-xl
                              border
                              text-lg
                              transition

                              ${
                                avatar ===
                                option
                                  ? `
                                    border-violet-400/25
                                    bg-violet-500/[0.10]
                                    shadow-[0_0_16px_rgba(124,58,237,0.08)]
                                  `
                                  : `
                                    border-white/[0.10]
                                    bg-white/[0.065]
                                    hover:bg-white/[0.065]
                                  `
                              }
                            `}
                          >
                            {
                              option
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <SettingsDivider />

                {/* PROFILE FIELDS */}

                <div
                  className="
                    grid
                    gap-4
                    md:grid-cols-2
                  "
                >
                  <ProfileField
                    label="Display name"
                    icon={
                      <User
                        size={14}
                      />
                    }
                  >
                    <input
                      value={
                        name
                      }
                      onChange={
                        event =>
                          setName(
                            event
                              .target
                              .value
                          )
                      }
                      placeholder="Display name"
                      className={inputClass}
                    />
                  </ProfileField>

                  <ProfileField
                    label="Username"
                    icon={
                      <AtSign
                        size={14}
                      />
                    }
                  >
                    <div
                      className="
                        relative
                      "
                    >
                      <span
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          text-white/42
                        "
                      >
                        @
                      </span>

                      <input
                        value={
                          username
                        }
                        onChange={
                          event =>
                            setUsername(
                              event
                                .target
                                .value
                                .replace(
                                  /^@/,
                                  ""
                                )
                            )
                        }
                        placeholder="username"
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  </ProfileField>

                  <ProfileField
                    label="Sign-in email"
                    icon={
                      <Mail
                        size={14}
                      />
                    }
                  >
                    <input
                      type="email"
                      value={
                        signInEmail
                      }
                      readOnly
                      aria-readonly="true"
                      title="Manage your sign-in email from Account & security."
                      className={`${inputClass} cursor-not-allowed text-white/45`}
                    />
                  </ProfileField>

                  <ProfileField
                    label="Region"
                    icon={
                      <Globe2
                        size={14}
                      />
                    }
                  >
                    <select
                      value={
                        flag
                      }
                      onChange={
                        event =>
                          setFlag(
                            event
                              .target
                              .value
                          )
                      }
                      className={inputClass}
                    >
                      {countryCodes.map(
                        code => (
                          <option
                            key={
                              code
                            }
                            value={
                              code
                            }
                            className="
                              bg-[#1a1d23]
                            "
                          >
                            {getFlagEmoji(
                              code
                            )}{" "}
                            {code}
                          </option>
                        )
                      )}
                    </select>
                  </ProfileField>
                </div>

                {/* SAVE */}

                <div
                  className="
                    mt-7
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-white/[0.10]
                    pt-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        font-medium
                        text-white/55
                      "
                    >
                      Listener profile
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-white/32
                      "
                    >
                      Profile changes are
                      saved to your SOA
                      account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      saveProfile
                    }
                    disabled={
                      profileStatus ===
                      "saving"
                    }
                    className={`
                      inline-flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-5
                      text-sm
                      font-semibold
                      transition
                      active:scale-[0.98]

                      ${
                        profileStatus ===
                        "saved"
                          ? `
                            bg-emerald-300
                            text-black
                          `
                          : profileStatus ===
                              "error"
                            ? `
                              bg-red-400
                              text-black
                            `
                            : `
                              bg-white
                              text-black
                              hover:bg-violet-50
                            `
                      }

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    `}
                  >
                    {profileStatus ===
                    "saving" ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : profileStatus ===
                      "saved" ? (
                      <Check
                        size={15}
                      />
                    ) : (
                      <Save
                        size={15}
                      />
                    )}

                    {profileStatus ===
                    "saving"
                      ? "Saving..."
                      : profileStatus ===
                          "saved"
                        ? "Saved"
                        : profileStatus ===
                            "error"
                          ? "Check fields"
                          : "Save profile"}
                  </button>
                </div>
              </SettingsPanel>
            )}

            {/* ==================================================
                LISTENING
            ================================================== */}

            {activeSection ===
              "listening" && (
              <SettingsPanel
                eyebrow="Playback"
                title="Listening"
                description="Make SOA behave the way you like to listen."
                icon={
                  <Headphones
                    size={19}
                  />
                }
              >
                <SettingGroup
                  title="Playback behavior"
                  description="Preferences saved on this device."
                >
                  <ToggleRow
                    icon={
                      <Radio
                        size={16}
                      />
                    }
                    title="Autoplay"
                    description="Keep the music moving after your current selection ends."
                    checked={
                      preferences.autoplay
                    }
                    onChange={
                      value =>
                        setPreference(
                          "autoplay",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Volume2
                        size={16}
                      />
                    }
                    title="Remember volume"
                    description="Keep your preferred player level between visits."
                    checked={
                      preferences.rememberVolume
                    }
                    onChange={
                      value =>
                        setPreference(
                          "rememberVolume",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Activity
                        size={16}
                      />
                    }
                    title="Volume normalization"
                    description="Prefer a more consistent loudness between tracks."
                    checked={
                      preferences.normalizeVolume
                    }
                    onChange={
                      value =>
                        setPreference(
                          "normalizeVolume",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Zap
                        size={16}
                      />
                    }
                    title="Reduce motion"
                    description="Use fewer animated transitions throughout the SOA interface."
                    checked={
                      preferences.reducedMotion
                    }
                    onChange={
                      value =>
                        setPreference(
                          "reducedMotion",
                          value
                        )
                    }
                  />
                </SettingGroup>

                <SettingsDivider />

                <SettingGroup
                  title="Preferred audio"
                  description="Choose your default quality preference."
                >
                  <ChoiceCards
                    value={
                      preferences.audioQuality
                    }
                    options={[
                      {
                        value:
                          "auto",
                        title:
                          "Automatic",
                        description:
                          "Balance quality and connection.",
                      },
                      {
                        value:
                          "high",
                        title:
                          "High",
                        description:
                          "Prioritize higher quality audio.",
                      },
                      {
                        value:
                          "max",
                        title:
                          "Maximum",
                        description:
                          "Prefer the best available stream.",
                      },
                    ]}
                    onChange={
                      value =>
                        setPreference(
                          "audioQuality",
                          value as PreferenceState["audioQuality"]
                        )
                    }
                  />
                </SettingGroup>
              </SettingsPanel>
            )}

            {/* ==================================================
                DISCOVERY
            ================================================== */}

            {activeSection ===
              "discovery" && (
              <SettingsPanel
                eyebrow="Personalization"
                title="Discovery"
                description="Tell SOA how adventurous your recommendations should feel."
                icon={
                  <Compass
                    size={19}
                  />
                }
              >
                <SettingGroup
                  title="Discovery style"
                  description="Control the balance between familiar artists and new music."
                >
                  <ChoiceCards
                    value={
                      preferences.discoveryStyle
                    }
                    options={[
                      {
                        value:
                          "familiar",
                        title:
                          "Familiar",
                        description:
                          "Lean toward artists and sounds you already know.",
                      },

                      {
                        value:
                          "balanced",
                        title:
                          "Balanced",
                        description:
                          "Mix familiar favorites with new discoveries.",
                      },

                      {
                        value:
                          "adventurous",
                        title:
                          "Adventurous",
                        description:
                          "Push farther into artists and sounds you haven't explored.",
                      },
                    ]}
                    onChange={
                      value =>
                        setPreference(
                          "discoveryStyle",
                          value as PreferenceState["discoveryStyle"]
                        )
                    }
                  />
                </SettingGroup>

                <SettingsDivider />

                <SettingGroup
                  title="Recommendation signals"
                  description="Control which signals can shape your SOA discovery experience."
                >
                  <ToggleRow
                    icon={
                      <Sparkles
                        size={16}
                      />
                    }
                    title="Personalized discovery"
                    description="Use your listening patterns to personalize what SOA surfaces."
                    checked={
                      preferences.personalizedDiscovery
                    }
                    onChange={
                      value =>
                        setPreference(
                          "personalizedDiscovery",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Clock3
                        size={16}
                      />
                    }
                    title="Listening history"
                    description="Let past plays influence future recommendations."
                    checked={
                      preferences.listeningHistoryRecommendations
                    }
                    onChange={
                      value =>
                        setPreference(
                          "listeningHistoryRecommendations",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Music2
                        size={16}
                      />
                    }
                    title="New release recommendations"
                    description="Surface new releases based on the artists and music you engage with."
                    checked={
                      preferences.newReleaseRecommendations
                    }
                    onChange={
                      value =>
                        setPreference(
                          "newReleaseRecommendations",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <RefreshCw
                        size={16}
                      />
                    }
                    title="Bring back favorites"
                    description="Mix music you've already enjoyed back into discovery."
                    checked={
                      preferences.surfaceFamiliarMusic
                    }
                    onChange={
                      value =>
                        setPreference(
                          "surfaceFamiliarMusic",
                          value
                        )
                    }
                  />
                </SettingGroup>
              </SettingsPanel>
            )}

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            {activeSection ===
              "notifications" && (
              <SettingsPanel
                eyebrow="Stay connected"
                title="Notifications"
                description="Choose which SOA moments are worth interrupting you for."
                icon={
                  <Bell
                    size={19}
                  />
                }
              >
                <SettingGroup
                  title="Artist updates"
                  description="Saved on this device for now."
                >
                  <ToggleRow
                    icon={
                      <Music2
                        size={16}
                      />
                    }
                    title="New releases"
                    description="Hear when artists you follow release new music."
                    checked={
                      preferences.newReleaseNotifications
                    }
                    onChange={
                      value =>
                        setPreference(
                          "newReleaseNotifications",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <CircleUserRound
                        size={16}
                      />
                    }
                    title="Artist updates"
                    description="Receive important posts and artist announcements."
                    checked={
                      preferences.artistNotifications
                    }
                    onChange={
                      value =>
                        setPreference(
                          "artistNotifications",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Radio
                        size={16}
                      />
                    }
                    title="Live & premieres"
                    description="Know when live streams, premieres and special moments begin."
                    checked={
                      preferences.liveNotifications
                    }
                    onChange={
                      value =>
                        setPreference(
                          "liveNotifications",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Sparkles
                        size={16}
                      />
                    }
                    title="Drops & merch"
                    description="Get notified about limited merchandise and special drops."
                    checked={
                      preferences.productNotifications
                    }
                    onChange={
                      value =>
                        setPreference(
                          "productNotifications",
                          value
                        )
                    }
                  />
                </SettingGroup>
              </SettingsPanel>
            )}

            {/* ==================================================
                PRIVACY
            ================================================== */}

            {activeSection ===
              "privacy" && (
              <SettingsPanel
                eyebrow="Visibility"
                title="Privacy"
                description="Choose what other listeners can see about you."
                icon={
                  <Shield
                    size={19}
                  />
                }
              >
                <SettingGroup
                  title="Your public presence"
                  description="These preferences are currently stored on this device."
                >
                  <ToggleRow
                    icon={
                      <Eye
                        size={16}
                      />
                    }
                    title="Public listener profile"
                    description="Allow other listeners to view your public SOA profile."
                    checked={
                      preferences.publicProfile
                    }
                    onChange={
                      value =>
                        setPreference(
                          "publicProfile",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Activity
                        size={16}
                      />
                    }
                    title="Listening activity"
                    description="Allow your public profile to show what you've been listening to."
                    checked={
                      preferences.showListeningActivity
                    }
                    onChange={
                      value =>
                        setPreference(
                          "showListeningActivity",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Music2
                        size={16}
                      />
                    }
                    title="Public playlists"
                    description="Allow public playlists to appear on your listener profile."
                    checked={
                      preferences.showPlaylists
                    }
                    onChange={
                      value =>
                        setPreference(
                          "showPlaylists",
                          value
                        )
                    }
                  />

                  <ToggleRow
                    icon={
                      <Globe2
                        size={16}
                      />
                    }
                    title="Show region"
                    description="Display your selected country beside your listener identity."
                    checked={
                      preferences.showCountry
                    }
                    onChange={
                      value =>
                        setPreference(
                          "showCountry",
                          value
                        )
                    }
                  />
                </SettingGroup>

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-blue-400/10
                    bg-blue-500/[0.025]
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      gap-3
                    "
                  >
                    <Lock
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-blue-200/40
                      "
                    />

                    <div>
                      <p
                        className="
                          text-sm
                          font-medium
                          text-white/65
                        "
                      >
                        Your account details
                        stay private.
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[10px]
                          leading-5
                          text-white/38
                        "
                      >
                        Email, authentication
                        details and security
                        credentials are not
                        part of the public
                        listener profile.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsPanel>
            )}

            {/* ==================================================
                ACCOUNT
            ================================================== */}

            {activeSection ===
              "account" && (
              <SettingsPanel
                eyebrow="SOA account"
                title="Account & security"
                description="Identity, sign-in methods and security are managed through your account."
                icon={
                  <KeyRound
                    size={19}
                  />
                }
              >
                {/* ACCOUNT IDENTITY */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/[0.10]
                    bg-white/[0.065]
                  "
                >
                  <AccountRow
                    icon={
                      <Mail
                        size={16}
                      />
                    }
                    title="Sign-in email"
                    value={
                      signInEmail
                    }
                  />

                  <AccountRow
                    icon={
                      <User
                        size={16}
                      />
                    }
                    title="SOA username"
                    value={`@${displayUsername}`}
                  />

                  <AccountRow
                    icon={
                      <Globe2
                        size={16}
                      />
                    }
                    title="Region"
                    value={`${getFlagEmoji(
                      flag
                    )} ${flag}`}
                    last
                  />
                </div>

                {/* SECURITY */}

                <div
                  className="
                    mt-6
                    rounded-[22px]
                    border
                    border-violet-400/10
                    bg-gradient-to-br
                    from-violet-500/[0.035]
                    to-transparent
                    p-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-violet-400/12
                          bg-violet-500/[0.05]
                          text-violet-100/45
                        "
                      >
                        <Lock
                          size={18}
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-white/75
                          "
                        >
                          Sign-in & security
                        </p>

                        <p
                          className="
                            mt-1.5
                            max-w-lg
                            text-[10px]
                            leading-5
                            text-white/38
                          "
                        >
                          Change your password,
                          manage sign-in methods,
                          connected accounts and
                          other security settings
                          securely through Clerk.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openUserProfile()
                      }
                      className="
                        inline-flex
                        h-11
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-white/[0.10]
                        bg-white/[0.055]
                        px-4
                        text-xs
                        font-medium
                        text-white/65
                        transition
                        hover:border-violet-400/20
                        hover:bg-violet-500/[0.06]
                        hover:text-white
                      "
                    >
                      Manage account

                      <ChevronRight
                        size={14}
                      />
                    </button>
                  </div>
                </div>

                {/* PLAN */}

                <div
                  className="
                    mt-6
                    rounded-[22px]
                    border
                    border-white/[0.10]
                    bg-[#1a1d23]
                    p-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div
                      className="
                        flex
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/[0.10]
                          bg-white/[0.055]
                          text-violet-200/40
                        "
                      >
                        <Sparkles
                          size={18}
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            text-white/32
                          "
                        >
                          Current plan
                        </p>

                        <p
                          className="
                            mt-1
                            text-lg
                            font-semibold
                          "
                        >
                          {plan}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-white/48
                          "
                        >
                          Your SOA listener
                          membership.
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        w-fit
                        rounded-full
                        border
                        border-violet-400/15
                        bg-violet-500/[0.05]
                        px-3
                        py-1.5
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-violet-100/45
                      "
                    >
                      {plan}
                    </span>
                  </div>
                </div>

                {/* DEVICE SETTINGS RESET */}

                <div
                  className="
                    mt-6
                    border-t
                    border-white/[0.10]
                    pt-6
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          font-medium
                          text-white/60
                        "
                      >
                        Reset listener
                        preferences
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-white/48
                        "
                      >
                        Restore Listening,
                        Discovery, Notifications
                        and Privacy preferences
                        to their defaults on this
                        device.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        resetPreferences
                      }
                      className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/[0.09]
                        bg-white/[0.055]
                        px-4
                        text-[10px]
                        font-medium
                        text-white/52
                        transition
                        hover:bg-white/[0.065]
                        hover:text-white/70
                      "
                    >
                      <RefreshCw
                        size={13}
                      />

                      Reset settings
                    </button>
                  </div>
                </div>
              </SettingsPanel>
            )}
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-10
            flex
            flex-col
            gap-2
            border-t
            border-white/[0.09]
            py-6
            text-[9px]
            text-white/27
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            SOA Music • Listener
            Settings
          </span>

          <span>
            Your profile belongs to
            you.
          </span>
        </footer>
      </div>
    </div>
  );
}

// =========================================================
// SETTINGS PANEL
// =========================================================

function SettingsPanel({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-white/[0.085]
        bg-[#1a1d23]
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          gap-4
          border-b
          border-white/[0.10]
          px-5
          py-5
          sm:px-6
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-violet-400/12
            bg-violet-500/[0.045]
            text-violet-200/45
          "
        >
          {icon}
        </div>

        <div>
          <p
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-violet-200/35
            "
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-semibold
              tracking-[-0.025em]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1.5
              max-w-xl
              text-[10px]
              leading-5
              text-white/27
            "
          >
            {description}
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          p-5
          sm:p-6
        "
      >
        {children}
      </div>
    </section>
  );
}

// =========================================================
// SETTING GROUP
// =========================================================

function SettingGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className="
          mb-4
        "
      >
        <h3
          className="
            text-sm
            font-semibold
            text-white/70
          "
        >
          {title}
        </h3>

        {description && (
          <p
            className="
              mt-1
              text-[10px]
              leading-5
              text-white/24
            "
          >
            {description}
          </p>
        )}
      </div>

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.10]
          bg-white/[0.012]
        "
      >
        {children}
      </div>
    </div>
  );
}

// =========================================================
// TOGGLE ROW
// =========================================================

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        border-b
        border-white/[0.09]
        px-4
        py-4
        last:border-b-0
        sm:px-5
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white/[0.055]
          text-white/38
        "
      >
        {icon}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-xs
            font-medium
            text-white/65
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            max-w-2xl
            text-[9px]
            leading-4
            text-white/24
          "
        >
          {description}
        </p>
      </div>

      <Toggle
        checked={
          checked
        }
        onChange={
          onChange
        }
      />
    </div>
  );
}

// =========================================================
// TOGGLE
// =========================================================

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={
        checked
      }
      onClick={() =>
        onChange(
          !checked
        )
      }
      className={`
        relative
        h-6
        w-11
        shrink-0
        rounded-full
        border
        transition

        ${
          checked
            ? `
              border-violet-400/25
              bg-violet-500/35
            `
            : `
              border-white/[0.10]
              bg-white/[0.065]
            `
        }
      `}
    >
      <span
        className={`
          absolute
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          rounded-full
          transition-all

          ${
            checked
              ? `
                left-[23px]
                bg-violet-100
                shadow-[0_0_10px_rgba(196,181,253,0.35)]
              `
              : `
                left-[3px]
                bg-white/40
              `
          }
        `}
      />
    </button>
  );
}

// =========================================================
// CHOICE CARDS
// =========================================================

function ChoiceCards({
  value,
  options,
  onChange,
}: {
  value: string;

  options: {
    value: string;
    title: string;
    description: string;
  }[];

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div
      className="
        grid
        gap-px
        bg-white/[0.065]
        md:grid-cols-3
      "
    >
      {options.map(
        option => {
          const active =
            value ===
            option.value;

          return (
            <button
              key={
                option.value
              }
              type="button"
              onClick={() =>
                onChange(
                  option.value
                )
              }
              className={`
                relative
                min-h-[130px]
                bg-[#1a1d23]
                p-5
                text-left
                transition

                ${
                  active
                    ? `
                      bg-violet-500/[0.055]
                    `
                    : `
                      hover:bg-white/[0.055]
                    `
                }
              `}
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <p
                  className={`
                    text-sm
                    font-semibold

                    ${
                      active
                        ? "text-violet-100"
                        : "text-white/65"
                    }
                  `}
                >
                  {
                    option.title
                  }
                </p>

                <div
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${
                      active
                        ? `
                          border-violet-300/30
                          bg-violet-400
                          text-black
                        `
                        : `
                          border-white/[0.10]
                          text-transparent
                        `
                    }
                  `}
                >
                  <Check
                    size={11}
                  />
                </div>
              </div>

              <p
                className="
                  mt-3
                  text-[9px]
                  leading-5
                  text-white/48
                "
              >
                {
                  option.description
                }
              </p>

              {active && (
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-violet-300/65
                    to-transparent
                  "
                />
              )}
            </button>
          );
        }
      )}
    </div>
  );
}

// =========================================================
// PROFILE FIELD
// =========================================================

function ProfileField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="
          flex
          items-center
          gap-2
          text-[9px]
          font-medium
          uppercase
          tracking-[0.11em]
          text-white/38
        "
      >
        <span
          className="
            text-violet-100/30
          "
        >
          {icon}
        </span>

        {label}
      </label>

      <div
        className="
          mt-2
        "
      >
        {children}
      </div>
    </div>
  );
}

// =========================================================
// SETTING LABEL
// =========================================================

function SettingLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p
      className="
        text-[9px]
        font-medium
        uppercase
        tracking-[0.12em]
        text-white/38
      "
    >
      {children}
    </p>
  );
}

// =========================================================
// DESKTOP NAV BUTTON
// =========================================================

function SettingsNavButton({
  icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-left
        transition

        ${
          active
            ? `
              bg-violet-500/[0.07]
            `
            : `
              hover:bg-white/[0.045]
            `
        }
      `}
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          transition

          ${
            active
              ? `
                border-violet-400/15
                bg-violet-500/[0.07]
                text-violet-200/65
              `
              : `
                border-white/[0.09]
                bg-white/[0.065]
                text-white/48
                group-hover:text-white/45
              `
          }
        `}
      >
        {icon}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className={`
            text-xs
            font-medium

            ${
              active
                ? "text-white/85"
                : "text-white/48"
            }
          `}
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[8px]
            text-white/27
          "
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={13}
        className={`
          shrink-0
          transition

          ${
            active
              ? "text-violet-200/45"
              : "text-white/10"
          }
        `}
      />
    </button>
  );
}

// =========================================================
// MOBILE TAB
// =========================================================

function MobileSettingsTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        whitespace-nowrap
        rounded-full
        border
        px-4
        py-2
        text-[9px]
        font-medium
        transition

        ${
          active
            ? `
              border-violet-400/18
              bg-violet-500/[0.08]
              text-violet-100
            `
            : `
              border-white/[0.10]
              bg-white/[0.065]
              text-white/48
            `
        }
      `}
    >
      {label}
    </button>
  );
}

// =========================================================
// ACCOUNT ROW
// =========================================================

function AccountRow({
  icon,
  title,
  value,
  last = false,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-4
        px-4
        py-4
        sm:px-5

        ${
          !last
            ? `
              border-b
              border-white/[0.09]
            `
            : ""
        }
      `}
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white/[0.055]
          text-white/48
        "
      >
        {icon}
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.11em]
            text-white/42
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            truncate
            text-xs
            font-medium
            text-white/55
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =========================================================
// DIVIDER
// =========================================================

function SettingsDivider() {
  return (
    <div
      className="
        my-7
        h-px
        bg-white/[0.075]
      "
    />
  );
}

// =========================================================
// LOADING
// =========================================================

function PageLoading() {
  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-center
        bg-[#15171c]
        px-5
        py-32
        text-white
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          text-sm
          text-white/48
        "
      >
        <Loader2
          size={17}
          className="
            animate-spin
            text-violet-300
          "
        />

        Loading your SOA...
      </div>
    </div>
  );
}

// =========================================================
// SIGNED OUT
// =========================================================

function SignedOutState() {
  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-center
        bg-[#15171c]
        px-5
        py-28
        text-white
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[26px]
          border
          border-white/[0.09]
          bg-[#1a1d23]
          p-7
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-violet-400/12
            bg-violet-500/[0.04]
            text-violet-200/40
          "
        >
          <User
            size={20}
          />
        </div>

        <h1
          className="
            mt-5
            text-xl
            font-semibold
          "
        >
          Your listener settings
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-white/42
          "
        >
          Sign in to manage your
          SOA profile and listening
          preferences.
        </p>

        <SignInButton
          mode="modal"
        >
          <button
            className="
              mt-6
              h-11
              rounded-xl
              bg-white
              px-5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-violet-50
            "
          >
            Sign in
          </button>
        </SignInButton>
      </div>
    </div>
  );
}

// =========================================================
// ACCOUNT SETUP
// =========================================================

function AccountSetupState() {
  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-center
        bg-[#15171c]
        px-5
        py-32
        text-white
      "
    >
      <div
        className="
          text-center
        "
      >
        <Loader2
          size={18}
          className="
            mx-auto
            animate-spin
            text-violet-300
          "
        />

        <p
          className="
            mt-4
            text-sm
            text-white/52
          "
        >
          Finishing your listener
          profile...
        </p>
      </div>
    </div>
  );
}

// =========================================================
// INPUT
// =========================================================

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-white/[0.09]
  bg-white/[0.065]
  px-4
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/27
  focus:border-violet-400/20
  focus:bg-violet-500/[0.025]
`;

// =========================================================
// FLAG
// =========================================================

function getFlagEmoji(
  code: string
) {
  if (
    !code ||
    code.length !== 2
  ) {
    return "🌐";
  }

  return code
    .toUpperCase()
    .replace(
      /./g,
      char =>
        String.fromCodePoint(
          127397 +
            char.charCodeAt(
              0
            )
        )
    );
}

// =========================================================
// IMAGE AVATAR
// =========================================================

function isImageUrl(
  value?: string
) {
  if (!value) {
    return false;
  }

  return (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    ) ||
    value.startsWith("/")
  );
}

// =========================================================
// FORMAT NUMBER
// =========================================================

function formatNumber(
  value: number
) {
  if (
    value >=
    1_000_000
  ) {
    return `${(
      value /
      1_000_000
    ).toFixed(
      value >=
      10_000_000
        ? 0
        : 1
    )}M`;
  }

  if (
    value >=
    1_000
  ) {
    return `${(
      value /
      1_000
    ).toFixed(
      value >=
      100_000
        ? 0
        : 1
    )}K`;
  }

  return value.toLocaleString();
}

// =========================================================
// LISTENING TIME
// =========================================================

function formatListeningTime(
  seconds: number
) {
  if (
    !Number.isFinite(
      seconds
    ) ||
    seconds <= 0
  ) {
    return "0m";
  }

  const hours =
    seconds /
    3600;

  if (hours >= 1) {
    if (hours >= 100) {
      return `${Math.round(
        hours
      ).toLocaleString()}h`;
    }

    return `${hours.toFixed(
      hours >= 10
        ? 0
        : 1
    )}h`;
  }

  const minutes =
    Math.max(
      1,
      Math.round(
        seconds /
          60
      )
    );

  return `${minutes}m`;
}

// =========================================================
// ENGAGEMENT LEVEL
// =========================================================

function formatEngagementLevel(
  value?:
    | "casual"
    | "active"
    | "superfan"
) {
  switch (value) {
    case "superfan":
      return "Superfan";

    case "active":
      return "Active Listener";

    default:
      return "Casual Listener";
  }
}

// =========================================================
// CAPITALIZE
// =========================================================

function capitalize(
  value: string
) {
  if (!value) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}