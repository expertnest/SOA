"use client";

import {
  Disc3,
  ListMusic,
  Loader2,
  Pause,
  Play,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMusic } from "@/hooks/MusicContext";

type SidebarTrack = {
  songId?: string;
  _id?: string;
  title?: string;
  artistId?: string;
  artistName?: string;
  coverImage?: string;
  duration?: number;
  audioUrl?: string;
  genre?: string;
  totalPlays?: number;
  skipRate?: number;
  replayRate?: number;
  projectId?: string | null;
  projectName?: string | null;
  projectType?: string | null;
  projectCoverImage?: string | null;
  trackNumber?: number | null;
};

type SidebarProject = {
  projectKey: string;
  projectId?: string | null;
  name: string;
  type?: string;
  coverImage?: string;
  releaseDate?: number | null;
  tracks: SidebarTrack[];
};

type SidebarArtist = {
  artistId: string;
  name: string;
  slug?: string;
  image?: string;
  projects: SidebarProject[];
  popularTracks: SidebarTrack[];
};

export default function SidebarLibrary() {
  const libraryData = useQuery(
    api.projects.getSidebarLibrary
  );

  const {
    currentSong,
    isPlaying,
    togglePlay,
    playSong,
  } = useMusic();

  const [selectedArtistId, setSelectedArtistId] =
    useState<string | null>(null);

  const [selectedProjectKey, setSelectedProjectKey] =
    useState<string | null>(null);

  const artists =
    (libraryData?.artists ?? []) as SidebarArtist[];

  const trendingSongs =
    (libraryData?.trending ?? []) as SidebarTrack[];

  // =========================================================
  // SELECTED ARTIST
  // =========================================================

  const activeArtist = useMemo(() => {
    if (!selectedArtistId) {
      return null;
    }

    return (
      artists.find(
        artist =>
          artist.artistId.toString() ===
          selectedArtistId
      ) ?? null
    );
  }, [artists, selectedArtistId]);

  // =========================================================
  // PROJECTS
  // =========================================================

  const projects = useMemo(() => {
    return [...(activeArtist?.projects ?? [])].sort(
      (a, b) =>
        (b.releaseDate ?? 0) -
        (a.releaseDate ?? 0)
    );
  }, [activeArtist]);

  const activeProject = useMemo(() => {
    if (!selectedProjectKey) {
      return null;
    }

    return (
      projects.find(
        project =>
          project.projectKey ===
          selectedProjectKey
      ) ?? null
    );
  }, [projects, selectedProjectKey]);

  // =========================================================
  // DISPLAY TRACKS
  // =========================================================

  const displayedSongs =
    activeProject
      ? activeProject.tracks
      : activeArtist
        ? activeArtist.popularTracks
        : trendingSongs;

  const sectionTitle =
    activeProject
      ? activeProject.name
      : activeArtist
        ? activeArtist.name
        : "Trending";

  const sectionSubtitle =
    activeProject
      ? `${activeArtist?.name ?? "SOA Music"} • ${formatProjectType(
          activeProject.type
        )}`
      : activeArtist
        ? "Popular tracks • choose a project"
        : "Popular across SOA";

  // =========================================================
  // ACTIONS
  // =========================================================

  const handleArtistSelect = (
    artist: SidebarArtist
  ) => {
    setSelectedArtistId(
      artist.artistId.toString()
    );

    // Important:
    // choosing an artist changes the circles to that
    // artist's real projects, but does NOT force-select
    // the first project. The tracks below become the
    // artist's popular tracks until a project is chosen.
    setSelectedProjectKey(null);
  };

  const handleBackToArtists = () => {
    setSelectedArtistId(null);
    setSelectedProjectKey(null);
  };

  const handleProjectSelect = (
    project: SidebarProject
  ) => {
    setSelectedProjectKey(
      project.projectKey
    );
  };

  const handleTrackPlay = (
    song: SidebarTrack
  ) => {
    if (
      getSongId(currentSong) ===
      getSongId(song)
    ) {
      togglePlay();
      return;
    }

    playSong(song as any);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (libraryData === undefined) {
    return (
      <section className="min-h-0 border-t border-white/[0.075] pt-3">
        <div className="flex items-center gap-2">
          <ListMusic
            size={13}
            className="text-white/35"
          />

          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/38">
            Library
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-5">
          <Loader2
            size={15}
            className="animate-spin text-violet-200/40"
          />
        </div>
      </section>
    );
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (
    artists.length === 0 &&
    trendingSongs.length === 0
  ) {
    return (
      <section className="min-h-0 border-t border-white/[0.075] pt-3">
        <div className="flex items-center gap-2">
          <ListMusic
            size={13}
            className="text-white/35"
          />

          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/38">
            Library
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-4 text-center">
          <p className="text-[10px] text-white/35">
            No published music is available yet.
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="flex min-h-0 flex-1 flex-col border-t border-white/[0.075] pt-3">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ListMusic
            size={13}
            className="shrink-0 text-white/35"
          />

          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/38">
            Library
          </p>
        </div>

        <p className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-white/22">
          {displayedSongs.length}{" "}
          {displayedSongs.length === 1
            ? "track"
            : "tracks"}
        </p>
      </div>

      {/* =====================================================
          CIRCLE NAVIGATION

          "Artists" is permanently fixed on the left.
          Only the artist/project bubbles on the right scroll.
      ===================================================== */}

      <div className="sticky top-0 z-20 mt-3 shrink-0 border-b border-white/[0.055] bg-[#12141a]/95 pt-1 backdrop-blur-xl">
        <div className="flex min-w-0 items-start gap-2.5">
          {/* PERMANENT LIBRARY HOME / BACK BUTTON */}

          <div className="shrink-0 border-r border-white/[0.07] pr-2.5">
            <CircleButton
              label="Artists"
              image="/assets/soalogo.png"
              active={!activeArtist}
              icon={<Users size={14} />}
              onClick={handleBackToArtists}
            />
          </div>

          {/* ONLY THIS SIDE SCROLLS HORIZONTALLY */}

          <div className="min-w-0 flex-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2.5">
              {/* ARTIST HOME */}

              {!activeArtist &&
                artists.map(artist => (
                  <CircleButton
                    key={artist.artistId.toString()}
                    label={artist.name}
                    image={
                      artist.image ||
                      "/assets/soalogo.png"
                    }
                    active={false}
                    onClick={() =>
                      handleArtistSelect(
                        artist
                      )
                    }
                  />
                ))}

              {/* SELECTED ARTIST'S PROJECTS
                  Already sorted newest -> oldest by releaseDate. */}

              {activeArtist &&
                projects.map(project => (
                  <CircleButton
                    key={project.projectKey}
                    label={project.name}
                    image={
                      project.coverImage ||
                      activeArtist.image ||
                      "/assets/soalogo.png"
                    }
                    active={
                      activeProject?.projectKey ===
                      project.projectKey
                    }
                    icon={
                      project.type ===
                      "single" ? (
                        <Disc3 size={13} />
                      ) : undefined
                    }
                    onClick={() =>
                      handleProjectSelect(
                        project
                      )
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CURRENT CONTEXT
      ===================================================== */}

      <div className="z-10 mt-1 flex shrink-0 items-end justify-between gap-3 border-b border-white/[0.065] bg-[#12141a]/95 pb-2 backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-white/80">
            {sectionTitle}
          </p>

          <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.11em] text-white/28">
            {sectionSubtitle}
          </p>
        </div>

        {activeArtist && (
          <button
            type="button"
            onClick={handleBackToArtists}
            className="shrink-0 text-[8px] font-medium text-violet-200/45 transition hover:text-violet-100"
          >
            All artists
          </button>
        )}
      </div>

      {/* =====================================================
          TRACK LIST
      ===================================================== */}

      <div className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
        {displayedSongs.length === 0 ? (
          <div className="flex min-h-[100px] items-center justify-center px-4 text-center">
            <p className="text-[9px] leading-5 text-white/30">
              {activeArtist
                ? "Choose one of this artist's projects above."
                : "No tracks available."}
            </p>
          </div>
        ) : (
          displayedSongs.map(
            (song, index) => {
              const current =
                getSongId(currentSong) ===
                getSongId(song);

              const playing =
                current && isPlaying;

              return (
                <button
                  key={getSongKey(
                    song,
                    index
                  )}
                  type="button"
                  onClick={() =>
                    handleTrackPlay(
                      song
                    )
                  }
                  className={`
                    group
                    flex
                    w-full
                    min-w-0
                    items-center
                    gap-2.5
                    rounded-lg
                    px-1.5
                    py-1.5
                    text-left
                    transition
                    ${
                      current
                        ? "bg-violet-500/[0.07]"
                        : "hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/[0.07] bg-[#191c23]">
                    <img
                      src={
                        song.coverImage ||
                        song.projectCoverImage ||
                        "/assets/soalogo.png"
                      }
                      alt={
                        song.title ||
                        "Track"
                      }
                      className="h-full w-full object-cover"
                    />

                    <div
                      className={`
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-black/45
                        transition
                        ${
                          current
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }
                      `}
                    >
                      {playing ? (
                        <Pause
                          size={11}
                          fill="currentColor"
                          className="text-white"
                        />
                      ) : (
                        <Play
                          size={11}
                          fill="currentColor"
                          className="ml-px text-white"
                        />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        truncate
                        text-[10px]
                        font-medium
                        transition
                        ${
                          current
                            ? "text-violet-100"
                            : "text-white/68 group-hover:text-white"
                        }
                      `}
                    >
                      {song.title ||
                        "Untitled"}
                    </p>

                    <p className="mt-0.5 truncate text-[8px] text-white/28">
                      {activeProject
                        ? `${
                            song.trackNumber ??
                            index + 1
                          }. ${
                            song.artistName ||
                            "SOA Artist"
                          }`
                        : song.projectName
                          ? `${
                              song.artistName ||
                              "SOA Artist"
                            } • ${
                              song.projectName
                            }`
                          : song.artistName ||
                            "SOA Artist"}
                    </p>
                  </div>

                  {current && (
                    <div className="flex shrink-0 items-end gap-[2px] pr-1">
                      <span
                        className={`h-1 w-[2px] rounded-full ${
                          isPlaying
                            ? "bg-blue-300"
                            : "bg-white/20"
                        }`}
                      />

                      <span
                        className={`h-2 w-[2px] rounded-full ${
                          isPlaying
                            ? "bg-violet-300"
                            : "bg-white/20"
                        }`}
                      />

                      <span
                        className={`h-3 w-[2px] rounded-full ${
                          isPlaying
                            ? "bg-purple-300"
                            : "bg-white/20"
                        }`}
                      />

                      <span
                        className={`h-2 w-[2px] rounded-full ${
                          isPlaying
                            ? "bg-violet-300"
                            : "bg-white/20"
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            }
          )
        )}
      </div>
    </section>
  );
}

// =========================================================
// CIRCLE BUTTON
// =========================================================

function CircleButton({
  label,
  image,
  active,
  icon,
  onClick,
}: {
  label: string;
  image: string;
  active: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-[58px] shrink-0 text-center"
      title={label}
    >
      <div
        className={`
          relative
          mx-auto
          flex
          h-11
          w-11
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          bg-[#191c23]
          transition
          ${
            active
              ? "border-violet-400/40 ring-2 ring-violet-500/[0.08]"
              : "border-white/[0.09] group-hover:border-violet-400/25"
          }
        `}
      >
        {icon && label === "Artists" ? (
          <div
            className={`
              flex
              h-full
              w-full
              items-center
              justify-center
              ${
                active
                  ? "bg-violet-500/[0.09] text-violet-200"
                  : "bg-white/[0.025] text-white/40 group-hover:text-white/70"
              }
            `}
          >
            {icon}
          </div>
        ) : (
          <>
            <img
              src={image}
              alt={label}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            {icon && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
                {icon}
              </div>
            )}
          </>
        )}
      </div>

      <p
        className={`
          mt-1.5
          truncate
          text-[7px]
          font-medium
          transition
          ${
            active
              ? "text-violet-100"
              : "text-white/32 group-hover:text-white/65"
          }
        `}
      >
        {label}
      </p>
    </button>
  );
}

// =========================================================
// HELPERS
// =========================================================

function formatProjectType(
  type?: string
) {
  if (!type) {
    return "Release";
  }

  if (type === "ep") {
    return "EP";
  }

  return (
    type.charAt(0).toUpperCase() +
    type.slice(1)
  );
}

function getSongId(
  song: any
): string | undefined {
  if (!song) {
    return undefined;
  }

  return (
    song.songId?.toString() ||
    song._id?.toString()
  );
}

function getSongKey(
  song: SidebarTrack,
  index: number
) {
  return (
    getSongId(song) ||
    `${
      song.artistName ??
      "artist"
    }-${
      song.title ??
      "song"
    }-${index}`
  );
}
