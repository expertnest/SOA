"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  Album,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Disc3,
  FileAudio,
  Image as ImageIcon,
  Loader2,
  Music2,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useAction,
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";


// ========================================================
// TYPES
// ========================================================

type ReleaseType =
  | "single"
  | "ep"
  | "album"
  | "mixtape";


type PublishMode =
  | "now"
  | "scheduled";


interface Track {
  id: string;
  title: string;
  genre: string;
  file: File | null;
  duration: number;
}


// ========================================================
// RELEASE TYPES
// ========================================================

const releaseTypes: {
  id: ReleaseType;
  label: string;
  icon: typeof Disc3;
}[] = [
  {
    id: "single",
    label: "Single",
    icon: Disc3,
  },
  {
    id: "ep",
    label: "EP",
    icon: Music2,
  },
  {
    id: "album",
    label: "Album",
    icon: Album,
  },
  {
    id: "mixtape",
    label: "Mixtape",
    icon: Music2,
  },
];


// ========================================================
// GENRE GROUPS
// ========================================================

const genreGroups = [
  {
    label: "Hip-Hop & Rap",
    genres: [
      "Hip-Hop / Rap",
      "Trap",
      "Melodic Trap",
      "Dark Trap",
      "Rage",
      "Drill",
      "Cloud Rap",
      "Alternative Hip-Hop",
    ],
  },

  {
    label: "R&B & Soul",
    genres: [
      "R&B",
      "Alternative R&B",
      "Contemporary R&B",
      "Trap Soul",
      "Neo Soul",
      "Soul",
    ],
  },

  {
    label: "Electronic & Dance",
    genres: [
      "Electronic",
      "EDM",
      "House",
      "Deep House",
      "Tech House",
      "Progressive House",
      "Techno",
      "Trance",
      "Dubstep",
      "Drum & Bass",
      "Future Bass",
      "Electronic Trap",
      "Hyperpop",
      "Dance",
      "Dance Pop",
      "Electropop",
    ],
  },

  {
    label: "Pop",
    genres: [
      "Pop",
      "Alternative Pop",
    ],
  },

  {
    label: "Latin",
    genres: [
      "Latin",
      "Latin Pop",
      "Reggaeton",
      "Latin Trap",
      "Dembow",
      "Bachata",
      "Salsa",
      "Afro-Latin",
    ],
  },

  {
    label: "Global",
    genres: [
      "Afrobeats",
      "Amapiano",
      "Dancehall",
      "Reggae",
    ],
  },

  {
    label: "Rock & Alternative",
    genres: [
      "Rock",
      "Alternative",
      "Indie",
      "Metal",
    ],
  },

  {
    label: "Other",
    genres: [
      "Jazz",
      "Funk",
      "Gospel",
      "Ambient",
      "Experimental",
      "Cinematic",
      "Lo-Fi",
      "Other",
    ],
  },
];


// ========================================================
// PAGE
// ========================================================

export default function ReleasesPage() {

  // ======================================================
  // CONVEX
  // ======================================================

  const createProject =
    useMutation(
      api.projects.createProject
    );


  const updateProject =
    useMutation(
      api.projects.updateProject
    );

  const publishProject =
    useMutation(
      api.projects.publishProject
    );

  const createSong =
    useMutation(
      api.songs.createSong
    );


  const getAudioUploadUrl =
    useAction(
      api.storage.getAudioUploadUrl
    );


  const getImageUploadUrl =
    useAction(
      api.storage.getImageUploadUrl
    );


    const memberships =
    useQuery(
      api.artists.access.getMyArtistMemberships
    );


  // ======================================================
  // STATE
  // ======================================================

  const [
    releaseType,
    setReleaseType,
  ] =
    useState<ReleaseType>(
      "single"
    );


  const [
    publishMode,
    setPublishMode,
  ] =
    useState<PublishMode>(
      "now"
    );

  const [
    title,
    setTitle,
  ] =
    useState("");


  const [
    description,
    setDescription,
  ] =
    useState("");


  const [
    releaseDate,
    setReleaseDate,
  ] =
    useState("");


  const [
    releaseTime,
    setReleaseTime,
  ] =
    useState(
      "00:00"
    );


  const [
    coverPreview,
    setCoverPreview,
  ] =
    useState("");


  const [
    coverFile,
    setCoverFile,
  ] =
    useState<File | null>(
      null
    );


  const [
    tracks,
    setTracks,
  ] =
    useState<Track[]>([]);


  const [
    expandedTrackId,
    setExpandedTrackId,
  ] =
    useState<string | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    uploadStatus,
    setUploadStatus,
  ] =
    useState("");


  // ======================================================
  // DERIVED UI
  // ======================================================

  const membership =
  memberships?.[0] ?? null;

const selectedArtist =
  membership?.artist ?? null;

const artistId =
  selectedArtist?._id ?? null;

const canManageReleases =
  membership?.role === "owner" ||
  membership?.role === "admin" ||
  membership?.role === "manager";


  const readyTrackCount =
    useMemo(
      () =>
        tracks.filter(
          track =>
            track.title.trim() &&
            track.genre.trim() &&
            track.file &&
            track.duration > 0
        ).length,
      [
        tracks,
      ]
    );


  const incompleteTrackCount =
    tracks.length -
    readyTrackCount;


  const releaseReady =
    Boolean(
      title.trim() &&
      artistId &&
      tracks.length > 0 &&
      readyTrackCount ===
        tracks.length
    );

    if (
        memberships !== undefined &&
        membership &&
        !canManageReleases
      ) {
        return (
          <main
            className="
              flex
              min-h-screen
              items-center
              justify-center
              bg-[#070707]
              px-5
              text-white
            "
          >
            <div
              className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                p-8
                text-center
              "
            >
              <AlertCircle
                size={24}
                className="mx-auto text-amber-300"
              />
      
              <h1 className="mt-4 text-xl font-semibold">
                Release access restricted
              </h1>
      
              <p className="mt-2 text-sm leading-6 text-white/40">
                Your artist role can view the workspace,
                but cannot create or manage releases.
              </p>
            </div>
          </main>
        );
      }

  const inputClass = `
    w-full
    rounded-xl
    border
    border-white/[0.08]
    bg-white/[0.035]
    px-4
    py-3.5
    text-sm
    text-white
    placeholder:text-white/25
    outline-none
    transition-all
    duration-200
    hover:border-white/[0.14]
    focus:border-purple-400/50
    focus:bg-white/[0.055]
    focus:ring-4
    focus:ring-purple-500/[0.05]
  `;


  // ======================================================
  // TRACK HELPERS
  // ======================================================

  const createEmptyTrack =
    (): Track => ({
      id:
        crypto.randomUUID(),

      title:
        "",

      genre:
        "",

      file:
        null,

      duration:
        0,
    });


  const addTrack = () => {

    if (
      releaseType ===
        "single" &&
      tracks.length >= 1
    ) {

      alert(
        "A single can only contain one track."
      );

      return;

    }


    const newTrack =
      createEmptyTrack();


    setTracks(
      prev => [
        ...prev,
        newTrack,
      ]
    );


    setExpandedTrackId(
      newTrack.id
    );

  };


  const updateTrack = (
    id: string,
    field: keyof Track,
    value: string | number | File | null
  ) => {

    setTracks(
      prev =>
        prev.map(
          track =>
            track.id === id
              ?
              {
                ...track,
                [field]:
                  value,
              }
              :
              track
        )
    );

  };


  const removeTrack = (
    id: string
  ) => {

    setTracks(
      prev =>
        prev.filter(
          track =>
            track.id !== id
        )
    );


    if (
      expandedTrackId === id
    ) {

      setExpandedTrackId(
        null
      );

    }

  };


  const toggleTrack = (
    id: string
  ) => {

    setExpandedTrackId(
      prev =>
        prev === id
          ?
          null
          :
          id
    );

  };


  // ======================================================
  // COVER
  // ======================================================

  const handleCover = (
    file: File
  ) => {

    setCoverFile(
      file
    );


    if (
      coverPreview
    ) {

      URL.revokeObjectURL(
        coverPreview
      );

    }


    const preview =
      URL.createObjectURL(
        file
      );


    setCoverPreview(
      preview
    );

  };


  // ======================================================
  // AUDIO
  // ======================================================

  const readAudioDuration =
    (
      file: File
    ): Promise<number> => {

      return new Promise(
        (
          resolve,
          reject
        ) => {

          const objectUrl =
            URL.createObjectURL(
              file
            );


          const audio =
            new Audio(
              objectUrl
            );


          audio.onloadedmetadata =
            () => {

              const duration =
                Math.floor(
                  audio.duration
                );


              URL.revokeObjectURL(
                objectUrl
              );


              resolve(
                duration
              );

            };


          audio.onerror =
            () => {

              URL.revokeObjectURL(
                objectUrl
              );


              reject(
                new Error(
                  `Could not read ${file.name}`
                )
              );

            };

        }
      );

    };


  const handleAudio =
    async (
      id: string,
      file: File
    ) => {

      try {

        const duration =
          await readAudioDuration(
            file
          );


        setTracks(
          prev =>
            prev.map(
              track => {

                if (
                  track.id !== id
                ) {
                  return track;
                }


                return {
                  ...track,
                  file,
                  duration,
                };

              }
            )
        );

      }
      catch (
        error
      ) {

        console.error(
          error
        );


        alert(
          `Could not read ${file.name}.`
        );

      }

    };


  // ======================================================
  // MULTIPLE AUDIO
  // ======================================================

  const handleMultipleAudio =
    async (
      files:
        FileList |
        File[]
    ) => {

      const selectedFiles =
        Array.from(
          files
        );


      if (
        selectedFiles.length === 0
      ) {
        return;
      }


      if (
        releaseType ===
          "single" &&
        selectedFiles.length > 1
      ) {

        alert(
          "A single can only contain one track."
        );

        return;

      }


      if (
        releaseType ===
          "single" &&
        tracks.length >= 1
      ) {

        alert(
          "A single already has a track."
        );

        return;

      }


      const newTracks:
        Track[] =
        [];


      for (
        const file
        of selectedFiles
      ) {

        try {

          const duration =
            await readAudioDuration(
              file
            );


          newTracks.push({
            id:
              crypto.randomUUID(),

            title:
              "",

            genre:
              "",

            file,

            duration,
          });

        }
        catch (
          error
        ) {

          console.error(
            error
          );

        }

      }


      setTracks(
        prev => [
          ...prev,
          ...newTracks,
        ]
      );


      if (
        newTracks.length === 1
      ) {

        setExpandedTrackId(
          newTracks[0].id
        );

      }

    };

// ======================================================
// R2
// ======================================================

const uploadFileToR2 = async (
  file: File,
  type: "audio" | "image",
  selectedArtistId: Id<"artists">,
  projectId: Id<"projects">,
  catalogNumber: string,
  releaseYear: number
) => {
  const projectName = title.trim();

  if (!projectName) {
    throw new Error("Could not determine project name.");
  }

  const contentType =
    file.type || (type === "audio" ? "audio/mpeg" : "image/jpeg");

  const uploadArgs = {
    artistId: selectedArtistId,
    projectId,
    projectName,
    releaseType,
    releaseYear,
    catalogNumber,
    fileName: file.name,
    contentType,
  };

  const signed =
    type === "audio"
      ? await getAudioUploadUrl(uploadArgs)
      : await getImageUploadUrl(uploadArgs);

      let response: Response | null = null;
      let lastError: unknown = null;
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await fetch(signed.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": contentType,
            },
            body: file,
          });
      
          if (response.ok) {
            break;
          }
      
          // Don't keep retrying obvious client/auth errors.
          if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            throw new Error(
              `R2 upload failed for ${file.name}: ${response.status}`
            );
          }
      
          lastError = new Error(
            `R2 upload failed for ${file.name}: ${response.status}`
          );
        } catch (error) {
          lastError = error;
        }
      
        if (attempt < 3) {
          const delay =
            attempt === 1
              ? 1500
              : 3000;
      
          await new Promise(resolve =>
            setTimeout(resolve, delay)
          );
        }
      }
      
      if (!response?.ok) {
        throw lastError instanceof Error
          ? lastError
          : new Error(
              `R2 upload failed for ${file.name}`
            );
      }
  return {
    url: signed.publicUrl,
    key: signed.key,
  };
};


  // ======================================================
  // DATE
  // ======================================================

  const getFinalReleaseDate =
    () => {

      if (
        publishMode ===
        "now"
      ) {

        return Date.now();

      }


      if (
        !releaseDate
      ) {

        throw new Error(
          "Choose a scheduled release date."
        );

      }


      const scheduled =
        new Date(
          `${releaseDate}T${releaseTime || "00:00"}`
        );


      const timestamp =
        scheduled.getTime();


      if (
        Number.isNaN(
          timestamp
        )
      ) {

        throw new Error(
          "Invalid scheduled release date."
        );

      }


      return timestamp;

    };


  // ======================================================
  // CREATE RELEASE
  // ======================================================

  const handleCreate =
    async () => {

      if (
        !title.trim()
      ) {

        alert(
          "Enter a release title."
        );

        return;

      }


      if (
        !artistId
      ) {

        alert(
          "Select an artist."
        );

        return;

      }


      if (
        tracks.length === 0
      ) {

        alert(
          "Add at least 1 track."
        );

        return;

      }


      if (
        releaseType ===
          "single" &&
        tracks.length > 1
      ) {

        alert(
          "A single can only contain one track."
        );

        return;

      }


      const invalidTrack =
        tracks.find(
          track =>
            !track.title.trim() ||
            !track.genre.trim() ||
            !track.file ||
            track.duration <= 0
        );


      if (
        invalidTrack
      ) {

        alert(
          "Every track needs a title, genre and audio file."
        );

        return;

      }


      let finalReleaseDate:
        number;


      try {

        finalReleaseDate =
          getFinalReleaseDate();

      }
      catch (
        error
      ) {

        alert(
          error instanceof Error
            ?
            error.message
            :
            "Invalid release date."
        );

        return;

      }


      setLoading(
        true
      );


      try {

        let coverUrl =
          "";


        setUploadStatus(
          "Creating release..."
        );


        const { projectId, catalogNumber } = await createProject({
          name: title.trim(),
          artistId,
          description: description.trim() ? description.trim() : undefined,
          type: releaseType,
          releaseDate: finalReleaseDate,
        });

        if (!catalogNumber) {
          throw new Error(
            "Catalog number was not generated for this release."
          );
        }

        const releaseYear = new Date(finalReleaseDate).getFullYear();


        if (
          coverFile
        ) {

          setUploadStatus(
            "Uploading cover artwork..."
          );


          const uploadedCover = await uploadFileToR2(
            coverFile,
            "image",
            artistId,
            projectId,
            catalogNumber,
            releaseYear
          );


          coverUrl =
            uploadedCover.url;


          setUploadStatus(
            "Saving cover artwork..."
          );


          await updateProject({
            projectId,

            coverImage:
              coverUrl,
          });

        }


        for (
          let i = 0;
          i <
          tracks.length;
          i++
        ) {

          const track =
            tracks[i];


          if (
            !track.file
          ) {

            throw new Error(
              `Missing audio file for ${track.title}`
            );

          }


          setUploadStatus(
            `Uploading ${i + 1} of ${tracks.length} — ${track.title}`
          );


          const uploadedAudio = await uploadFileToR2(
            track.file,
            "audio",
            artistId,
            projectId,
            catalogNumber,
            releaseYear
          );


          setUploadStatus(
            `Saving ${i + 1} of ${tracks.length} — ${track.title}`
          );


          await createSong({

            title:
              track.title.trim(),

            artistId,

            duration:
              track.duration,

            genre:
              track.genre.trim(),

            coverImage:
              coverUrl ||
              undefined,

            audioUrl:
              uploadedAudio.url,

            projectId,

            trackNumber:
              i + 1,

          });

        }


        if (publishMode === "now") {
          setUploadStatus(
            "Publishing release..."
          );
        
          await publishProject({
            projectId,
          });
        }
      

        setUploadStatus(
          publishMode === "now"
            ? "Release published successfully."
            : "Release scheduled successfully."
        );


        if (
          coverPreview
        ) {

          URL.revokeObjectURL(
            coverPreview
          );

        }


        setTitle(
          ""
        );

        setDescription(
          ""
        );

        setReleaseDate(
          ""
        );

        setReleaseTime(
          "00:00"
        );

        setPublishMode(
          "now"
        );

        
        setReleaseType(
          "single"
        );

        setTracks(
          []
        );

        setExpandedTrackId(
          null
        );

        setCoverPreview(
          ""
        );

        setCoverFile(
          null
        );


        alert(
          "Release created successfully."
        );

      }
      catch (
        error
      ) {

        console.error(
          error
        );


        setUploadStatus(
          ""
        );


        alert(
          error instanceof Error
            ?
            error.message
            :
            "Failed to create release."
        );

      }
      finally {

        setLoading(
          false
        );

      }

    };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#070707]
        text-white
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -left-32
            -top-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-purple-600/[0.10]
            blur-[150px]
          "
        />


        <div
          className="
            absolute
            right-[-180px]
            top-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/[0.06]
            blur-[170px]
          "
        />

      </div>


      {/* PAGE */}

      <div
        className="
          relative
          mx-auto
          max-w-[1440px]
          px-5
          pb-32
          pt-10
          sm:px-8
          lg:px-10
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            border-b
            border-white/[0.07]
            pb-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-purple-300/80
              "
            >

              <Sparkles
                size={14}
              />

              Music Management

            </div>


            <h1
              className="
                text-3xl
                font-semibold
                tracking-[-0.04em]
                sm:text-4xl
              "
            >
              Create Release
            </h1>


            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-white/40
              "
            >
              Upload your music, organize the tracklist,
              and choose when the release goes live.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-white/[0.08]
              bg-white/[0.035]
              px-3
              py-1.5
              text-xs
              text-white/45
              lg:self-auto
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-amber-400
              "
            />

            Draft

          </div>

        </div>


        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div
          className="
            grid
            items-start
            gap-10
            lg:grid-cols-[300px_minmax(0,1fr)]
          "
        >

          {/* =================================================
              LEFT RAIL
          ================================================= */}

          <aside
            className="
              space-y-5
              lg:sticky
              lg:top-8
            "
          >

            {/* ARTWORK */}

            <div>

              <p
                className="
                  mb-3
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-white/35
                "
              >
                Artwork
              </p>


              <label
                className="
                  group
                  relative
                  flex
                  aspect-square
                  cursor-pointer
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-dashed
                  border-white/[0.12]
                  bg-white/[0.025]
                  transition-all
                  duration-300
                  hover:border-purple-400/35
                  hover:bg-purple-500/[0.035]
                "
              >

                {
                  coverPreview
                    ?
                    (
                      <>
                        <img
                          src={
                            coverPreview
                          }
                          alt="Release artwork"
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />


                        <div
                          className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/60
                            opacity-0
                            transition
                            group-hover:opacity-100
                          "
                        >

                          <span
                            className="
                              rounded-full
                              bg-white
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-black
                            "
                          >
                            Replace artwork
                          </span>

                        </div>
                      </>
                    )
                    :
                    (
                      <div
                        className="
                          px-6
                          text-center
                        "
                      >

                        <div
                          className="
                            mx-auto
                            mb-4
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-white/[0.04]
                          "
                        >

                          <ImageIcon
                            size={24}
                            className="
                              text-white/35
                            "
                          />

                        </div>


                        <p
                          className="
                            text-sm
                            font-medium
                            text-white/75
                          "
                        >
                          Add artwork
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-white/30
                          "
                        >
                          JPG, PNG or WEBP
                        </p>

                      </div>
                    )
                }


                <input
                  hidden
                  type="file"
                  accept="image/*"
                  disabled={
                    loading
                  }

                  onChange={(
                    e
                  ) => {

                    const file =
                      e.target
                        .files?.[0];


                    if (
                      file
                    ) {

                      handleCover(
                        file
                      );

                    }

                  }}
                />

              </label>

            </div>


            {/* SUMMARY */}

            <div
              className="
                border-t
                border-white/[0.07]
                pt-5
              "
            >

              <p
                className="
                  truncate
                  text-lg
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                {
                  title.trim() ||
                  "Untitled Release"
                }
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-white/40
                "
              >
                {
                  selectedArtist?.name ||
                  "No artist selected"
                }
              </p>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >

                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    px-2.5
                    py-1
                    text-[11px]
                    capitalize
                    text-white/50
                  "
                >
                  {
                    releaseType
                  }
                </span>


                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    px-2.5
                    py-1
                    text-[11px]
                    text-white/50
                  "
                >
                  {
                    tracks.length
                  }{" "}
                  {
                    tracks.length === 1
                      ?
                      "track"
                      :
                      "tracks"
                  }
                </span>

              </div>

            </div>

          </aside>


          {/* =================================================
              WORKSPACE
          ================================================= */}

          <main
            className="
              min-w-0
              space-y-12
            "
          >

            {/* =================================================
                RELEASE DETAILS
            ================================================= */}

            <section>

              <SectionHeading
                number="01"
                title="Release details"
                description="Core information fans will see."
              />


              <div
                className="
                  mt-6
                  space-y-6
                "
              >

                {/* TITLE */}

                <FieldLabel
                  label="Release title"
                >

                  <input
                    className={
                      inputClass
                    }

                    placeholder="Enter release title"

                    value={
                      title
                    }

                    disabled={
                      loading
                    }

                    onChange={(
                      e
                    ) =>
                      setTitle(
                        e.target.value
                      )
                    }
                  />

                </FieldLabel>


                {/* ARTIST + TYPE */}

                <div
                  className="
                    grid
                    gap-6
                    xl:grid-cols-2
                  "
                >

                  <FieldLabel
                    label="Artist"
                  >

                    <div
                      className="
                        grid
                        gap-2
                        sm:grid-cols-2
                      "
                    >
                     <FieldLabel label="Artist">
  {memberships === undefined ? (
    <div
      className="
        flex
        items-center
        rounded-xl
        border
        border-white/[0.08]
        bg-white/[0.025]
        px-4
        py-4
        text-sm
        text-white/35
      "
    >
      Loading artist...
    </div>
  ) : selectedArtist ? (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-purple-400/25
        bg-purple-500/[0.06]
        px-4
        py-3
      "
    >
      {selectedArtist.image ? (
        <img
          src={selectedArtist.image}
          alt={selectedArtist.name}
          className="
            h-9
            w-9
            rounded-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-purple-500
            to-cyan-400
            text-xs
            font-bold
            text-white
          "
        >
          {selectedArtist.name
            .slice(0, 1)
            .toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {selectedArtist.name}
        </p>

        <p className="mt-0.5 text-xs capitalize text-white/35">
          {membership?.role} access
        </p>
      </div>

      <Check
        size={16}
        className="text-purple-300"
      />
    </div>
  ) : (
    <div
      className="
        rounded-xl
        border
        border-red-400/20
        bg-red-500/[0.05]
        px-4
        py-4
        text-sm
        text-red-300/70
      "
    >
      No active artist access found.
    </div>
  )}
</FieldLabel>

                    </div>

                  </FieldLabel>


                  <FieldLabel
                    label="Release type"
                  >

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-2
                        rounded-xl
                        border
                        border-white/[0.08]
                        bg-white/[0.02]
                        p-1.5
                        sm:grid-cols-4
                        xl:grid-cols-2
                      "
                    >

                      {
                        releaseTypes.map(
                          item => {

                            const Icon =
                              item.icon;


                            const active =
                              releaseType ===
                              item.id;


                            return (

                              <button
                                key={
                                  item.id
                                }

                                type="button"

                                disabled={
                                  loading
                                }

                                onClick={() => {

                                  if (
                                    item.id ===
                                      "single" &&
                                    tracks.length > 1
                                  ) {

                                    alert(
                                      "Remove extra tracks before switching to Single."
                                    );

                                    return;

                                  }


                                  setReleaseType(
                                    item.id
                                  );

                                }}

                                className={`
                                  flex
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-xs
                                  font-medium
                                  transition-all

                                  ${
                                    active
                                      ?
                                      `
                                        bg-white
                                        text-black
                                        shadow-lg
                                        shadow-black/20
                                      `
                                      :
                                      `
                                        text-white/45
                                        hover:bg-white/[0.05]
                                        hover:text-white/80
                                      `
                                  }
                                `}
                              >

                                <Icon
                                  size={14}
                                />

                                {
                                  item.label
                                }

                              </button>

                            );

                          }
                        )
                      }

                    </div>

                  </FieldLabel>

                </div>


                {/* DESCRIPTION */}

                <FieldLabel
                  label="Description"
                  optional
                >

                  <textarea
                    className={`
                      ${inputClass}
                      min-h-28
                      resize-none
                    `}

                    placeholder="Tell fans about the release..."

                    value={
                      description
                    }

                    disabled={
                      loading
                    }

                    onChange={(
                      e
                    ) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />

                </FieldLabel>

              </div>

            </section>


            {/* =================================================
                TRACKLIST
            ================================================= */}

            <section>

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >

                <SectionHeading
                  number="02"
                  title="Tracklist"
                  description="Upload and organize every track in this release."
                />


                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  <button
                    type="button"

                    onClick={
                      addTrack
                    }

                    disabled={
                      loading
                    }

                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-white/[0.09]
                      bg-white/[0.03]
                      px-3.5
                      py-2.5
                      text-xs
                      font-medium
                      text-white/55
                      transition
                      hover:border-white/[0.14]
                      hover:bg-white/[0.06]
                      hover:text-white
                      disabled:opacity-40
                    "
                  >

                    <Plus
                      size={14}
                    />

                    Empty Track

                  </button>


                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-lg
                      bg-white
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-black
                      transition
                      hover:bg-white/90
                    "
                  >

                    <UploadCloud
                      size={14}
                    />

                    Add Tracks


                    <input
                      hidden
                      type="file"
                      accept="audio/*"

                      multiple={
                        releaseType !==
                        "single"
                      }

                      disabled={
                        loading
                      }

                      onChange={(
                        e
                      ) => {

                        if (
                          e.target.files
                        ) {

                          handleMultipleAudio(
                            e.target.files
                          );

                        }


                        e.target.value =
                          "";

                      }}
                    />

                  </label>

                </div>

              </div>


              <div
                className="
                  mt-6
                  overflow-visible
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#0b0b0b]
                "
              >

                {/* TABLE HEADER */}

                {
                  tracks.length > 0
                  &&
                  (
                    <div
                      className="
                        hidden
                        grid-cols-[52px_minmax(0,1fr)_130px_85px_110px_46px]
                        items-center
                        border-b
                        border-white/[0.07]
                        px-3
                        py-3
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.14em]
                        text-white/25
                        lg:grid
                      "
                    >

                      <span>
                        #
                      </span>

                      <span>
                        Track
                      </span>

                      <span>
                        Genre
                      </span>

                      <span>
                        Duration
                      </span>

                      <span>
                        Status
                      </span>

                      <span />

                    </div>
                  )
                }


                {
                  tracks.length === 0
                    ?
                    (
                      <div
                        className="
                          flex
                          min-h-[260px]
                          flex-col
                          items-center
                          justify-center
                          px-6
                          text-center
                        "
                      >

                        <div
                          className="
                            mb-4
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/[0.08]
                            bg-white/[0.03]
                          "
                        >

                          <FileAudio
                            size={21}
                            className="
                              text-white/25
                            "
                          />

                        </div>


                        <p
                          className="
                            text-sm
                            font-medium
                            text-white/70
                          "
                        >
                          Your tracklist is empty
                        </p>


                        <p
                          className="
                            mt-1
                            max-w-sm
                            text-xs
                            leading-5
                            text-white/30
                          "
                        >
                          Add one or multiple audio files.
                          You can enter the public song titles separately.
                        </p>


                        <label
                          className="
                            mt-5
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-lg
                            bg-white
                            px-4
                            py-2.5
                            text-xs
                            font-semibold
                            text-black
                          "
                        >

                          <UploadCloud
                            size={14}
                          />

                          Select Audio


                          <input
                            hidden
                            type="file"
                            accept="audio/*"

                            multiple={
                              releaseType !==
                              "single"
                            }

                            disabled={
                              loading
                            }

                            onChange={(
                              e
                            ) => {

                              if (
                                e.target.files
                              ) {

                                handleMultipleAudio(
                                  e.target.files
                                );

                              }


                              e.target.value =
                                "";

                            }}
                          />

                        </label>

                      </div>
                    )
                    :
                    (
                      tracks.map(
                        (
                          track,
                          index
                        ) => {

                          const expanded =
                            expandedTrackId ===
                            track.id;


                          const status =
                            getTrackStatus(
                              track
                            );


                          return (

                            <div
                              key={
                                track.id
                              }

                              className="
                                relative
                                border-b
                                border-white/[0.07]
                                last:border-b-0
                              "
                            >

                              {/* TRACK ROW */}

                              <div
                                className="
                                  grid
                                  items-center
                                  gap-3
                                  px-3
                                  py-3.5
                                  transition
                                  hover:bg-white/[0.018]
                                  lg:grid-cols-[52px_minmax(0,1fr)_130px_85px_110px_46px]
                                "
                              >

                                {/* NUMBER */}

                                <div
                                  className="
                                    hidden
                                    pl-2
                                    text-xs
                                    tabular-nums
                                    text-white/25
                                    lg:block
                                  "
                                >
                                  {
                                    String(
                                      index + 1
                                    ).padStart(
                                      2,
                                      "0"
                                    )
                                  }
                                </div>


                                {/* TRACK */}

                                <div
                                  className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3
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
                                      rounded-lg
                                      bg-white/[0.04]
                                      text-xs
                                      text-white/30
                                      lg:hidden
                                    "
                                  >
                                    {
                                      String(
                                        index + 1
                                      ).padStart(
                                        2,
                                        "0"
                                      )
                                    }
                                  </div>


                                  <div
                                    className="
                                      min-w-0
                                    "
                                  >

                                    <p
                                      className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-white/90
                                      "
                                    >
                                      {
                                        track.title.trim() ||
                                        "Untitled Track"
                                      }
                                    </p>


                                    <p
                                      className="
                                        mt-1
                                        truncate
                                        text-xs
                                        text-white/28
                                      "
                                    >
                                      {
                                        track.file
                                          ?
                                          track.file.name
                                          :
                                          "No audio selected"
                                      }
                                    </p>

                                  </div>

                                </div>


                                {/* GENRE */}

                                <div
                                  className="
                                    hidden
                                    lg:block
                                  "
                                >

                                  {
                                    track.genre
                                      ?
                                      (
                                        <span
                                          className="
                                            inline-flex
                                            max-w-full
                                            truncate
                                            rounded-md
                                            bg-white/[0.045]
                                            px-2
                                            py-1
                                            text-[11px]
                                            text-white/45
                                          "
                                        >
                                          {
                                            track.genre
                                          }
                                        </span>
                                      )
                                      :
                                      (
                                        <span
                                          className="
                                            text-xs
                                            text-white/20
                                          "
                                        >
                                          —
                                        </span>
                                      )
                                  }

                                </div>


                                {/* DURATION */}

                                <div
                                  className="
                                    hidden
                                    text-xs
                                    tabular-nums
                                    text-white/35
                                    lg:block
                                  "
                                >
                                  {
                                    track.duration > 0
                                      ?
                                      formatDuration(
                                        track.duration
                                      )
                                      :
                                      "—"
                                  }
                                </div>


                                {/* STATUS */}

                                <div
                                  className="
                                    hidden
                                    lg:block
                                  "
                                >

                                  <TrackStatusBadge
                                    status={
                                      status
                                    }
                                  />

                                </div>


                                {/* EDIT */}

                                <button
                                  type="button"

                                  onClick={() =>
                                    toggleTrack(
                                      track.id
                                    )
                                  }

                                  className="
                                    absolute
                                    right-3
                                    top-1/2
                                    flex
                                    h-8
                                    w-8
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-white/35
                                    transition
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                    lg:static
                                    lg:translate-y-0
                                  "
                                >

                                  {
                                    expanded
                                      ?
                                      (
                                        <ChevronUp
                                          size={16}
                                        />
                                      )
                                      :
                                      (
                                        <ChevronDown
                                          size={16}
                                        />
                                      )
                                  }

                                </button>

                              </div>


                              {/* MOBILE STATUS */}

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-16
                                  pb-3
                                  lg:hidden
                                "
                              >

                                <TrackStatusBadge
                                  status={
                                    status
                                  }
                                />


                                {
                                  track.duration > 0
                                  &&
                                  (
                                    <span
                                      className="
                                        text-[11px]
                                        text-white/30
                                      "
                                    >
                                      {
                                        formatDuration(
                                          track.duration
                                        )
                                      }
                                    </span>
                                  )
                                }

                              </div>


                              {/* EDITOR */}

                              <AnimatePresence
                                initial={false}
                              >

                                {
                                  expanded
                                  &&
                                  (

                                    <motion.div
                                      initial={{
                                        height:
                                          0,
                                        opacity:
                                          0,
                                      }}

                                      animate={{
                                        height:
                                          "auto",
                                        opacity:
                                          1,
                                      }}

                                      exit={{
                                        height:
                                          0,
                                        opacity:
                                          0,
                                      }}

                                      transition={{
                                        duration:
                                          0.18,
                                      }}

                                      className="
                                        overflow-visible
                                      "
                                    >

                                      <div
                                        className="
                                          border-t
                                          border-white/[0.07]
                                          bg-white/[0.015]
                                          px-4
                                          py-5
                                          lg:px-[64px]
                                        "
                                      >

                                        <div
                                          className="
                                            grid
                                            gap-4
                                            xl:grid-cols-2
                                          "
                                        >

                                          <FieldLabel
                                            label="Song title"
                                          >

                                            <input
                                              className={
                                                inputClass
                                              }

                                              placeholder="Enter public song title"

                                              value={
                                                track.title
                                              }

                                              disabled={
                                                loading
                                              }

                                              onChange={(
                                                e
                                              ) =>
                                                updateTrack(
                                                  track.id,
                                                  "title",
                                                  e.target.value
                                                )
                                              }
                                            />

                                          </FieldLabel>


                                          <FieldLabel
                                            label="Genre"
                                          >

                                            <GenreDropdown
                                              value={
                                                track.genre
                                              }

                                              disabled={
                                                loading
                                              }

                                              onChange={(
                                                value
                                              ) =>
                                                updateTrack(
                                                  track.id,
                                                  "genre",
                                                  value
                                                )
                                              }
                                            />

                                          </FieldLabel>

                                        </div>


                                        <div
                                          className="
                                            mt-5
                                            flex
                                            flex-col
                                            gap-3
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                          "
                                        >

                                          <div
                                            className="
                                              flex
                                              min-w-0
                                              items-center
                                              gap-3
                                            "
                                          >

                                            <label
                                              className="
                                                flex
                                                cursor-pointer
                                                items-center
                                                gap-2
                                                rounded-lg
                                                border
                                                border-white/[0.09]
                                                bg-white/[0.03]
                                                px-3.5
                                                py-2.5
                                                text-xs
                                                font-medium
                                                text-white/60
                                                transition
                                                hover:bg-white/[0.06]
                                                hover:text-white
                                              "
                                            >

                                              <FileAudio
                                                size={14}
                                              />


                                              {
                                                track.file
                                                  ?
                                                  "Replace audio"
                                                  :
                                                  "Choose audio"
                                              }


                                              <input
                                                hidden
                                                type="file"
                                                accept="audio/*"

                                                disabled={
                                                  loading
                                                }

                                                onChange={(
                                                  e
                                                ) => {

                                                  const file =
                                                    e.target
                                                      .files?.[0];


                                                  if (
                                                    file
                                                  ) {

                                                    handleAudio(
                                                      track.id,
                                                      file
                                                    );

                                                  }


                                                  e.target.value =
                                                    "";

                                                }}
                                              />

                                            </label>


                                            {
                                              track.file
                                              &&
                                              (
                                                <span
                                                  className="
                                                    max-w-[240px]
                                                    truncate
                                                    text-xs
                                                    text-white/28
                                                  "
                                                >
                                                  {
                                                    track.file.name
                                                  }
                                                </span>
                                              )
                                            }

                                          </div>


                                          <button
                                            type="button"

                                            disabled={
                                              loading
                                            }

                                            onClick={() =>
                                              removeTrack(
                                                track.id
                                              )
                                            }

                                            className="
                                              flex
                                              items-center
                                              justify-center
                                              gap-2
                                              rounded-lg
                                              px-3
                                              py-2
                                              text-xs
                                              text-red-400/70
                                              transition
                                              hover:bg-red-500/[0.07]
                                              hover:text-red-300
                                            "
                                          >

                                            <Trash2
                                              size={14}
                                            />

                                            Remove track

                                          </button>

                                        </div>

                                      </div>

                                    </motion.div>

                                  )
                                }

                              </AnimatePresence>

                            </div>

                          );

                        }
                      )
                    )
                }

              </div>


              {
                tracks.length > 0
                &&
                (
                  <div
                    className="
                      mt-4
                      flex
                      justify-center
                    "
                  >

                    <label
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-lg
                        px-4
                        py-2.5
                        text-xs
                        font-medium
                        text-white/40
                        transition
                        hover:bg-white/[0.04]
                        hover:text-white/70
                      "
                    >

                      <Plus
                        size={14}
                      />

                      Add more tracks


                      <input
                        hidden
                        type="file"
                        accept="audio/*"

                        multiple={
                          releaseType !==
                          "single"
                        }

                        disabled={
                          loading
                        }

                        onChange={(
                          e
                        ) => {

                          if (
                            e.target.files
                          ) {

                            handleMultipleAudio(
                              e.target.files
                            );

                          }


                          e.target.value =
                            "";

                        }}
                      />

                    </label>

                  </div>
                )
              }

            </section>


            {/* =================================================
                PUBLISHING
            ================================================= */}

            <section>

              <SectionHeading
                number="03"
                title="Publishing"
                description="Release immediately or schedule a future drop."
              />


              <div
                className="
                  mt-6
                  grid
                  gap-3
                  md:grid-cols-2
                "
              >

                <PublishOption
                  active={
                    publishMode ===
                    "now"
                  }

                  icon={
                    UploadCloud
                  }

                  title="Publish now"

                  description="Use the current date and time."

                  onClick={() =>
                    setPublishMode(
                      "now"
                    )
                  }

                  disabled={
                    loading
                  }
                />


                <PublishOption
                  active={
                    publishMode ===
                    "scheduled"
                  }

                  icon={
                    Calendar
                  }

                  title="Schedule release"

                  description="Choose a future release date and time."

                  onClick={() =>
                    setPublishMode(
                      "scheduled"
                    )
                  }

                  disabled={
                    loading
                  }
                />

              </div>


              <AnimatePresence>

                {
                  publishMode ===
                    "scheduled"
                  &&
                  (

                    <motion.div
                      initial={{
                        opacity:
                          0,
                        y:
                          -8,
                      }}

                      animate={{
                        opacity:
                          1,
                        y:
                          0,
                      }}

                      exit={{
                        opacity:
                          0,
                        y:
                          -8,
                      }}

                      className="
                        mt-5
                        grid
                        gap-4
                        md:grid-cols-2
                      "
                    >

                      <FieldLabel
                        label="Release date"
                      >

                        <div
                          className="
                            relative
                          "
                        >

                          <Calendar
                            size={15}
                            className="
                              pointer-events-none
                              absolute
                              left-4
                              top-1/2
                              -translate-y-1/2
                              text-white/25
                            "
                          />


                          <input
                            type="date"

                            className={`
                              ${inputClass}
                              pl-11
                            `}

                            value={
                              releaseDate
                            }

                            disabled={
                              loading
                            }

                            onChange={(
                              e
                            ) =>
                              setReleaseDate(
                                e.target.value
                              )
                            }
                          />

                        </div>

                      </FieldLabel>


                      <FieldLabel
                        label="Release time"
                      >

                        <div
                          className="
                            relative
                          "
                        >

                          <Clock3
                            size={15}
                            className="
                              pointer-events-none
                              absolute
                              left-4
                              top-1/2
                              -translate-y-1/2
                              text-white/25
                            "
                          />


                          <input
                            type="time"

                            className={`
                              ${inputClass}
                              pl-11
                            `}

                            value={
                              releaseTime
                            }

                            disabled={
                              loading
                            }

                            onChange={(
                              e
                            ) =>
                              setReleaseTime(
                                e.target.value
                              )
                            }
                          />

                        </div>

                      </FieldLabel>

                    </motion.div>

                  )
                }

              </AnimatePresence>

            </section>

          </main>

        </div>

      </div>


      {/* =====================================================
          STICKY BOTTOM BAR
      ===================================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[200]
          border-t
          border-white/[0.08]
          bg-[#080808]/90
          backdrop-blur-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-[1440px]
            flex-col
            gap-3
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
            lg:px-10
          "
        >

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >

            {
              loading
                ?
                (
                  <Loader2
                    size={16}
                    className="
                      shrink-0
                      animate-spin
                      text-purple-300
                    "
                  />
                )
                :
                releaseReady
                  ?
                  (
                    <CheckCircle2
                      size={17}
                      className="
                        shrink-0
                        text-emerald-400
                      "
                    />
                  )
                  :
                  (
                    <AlertCircle
                      size={17}
                      className="
                        shrink-0
                        text-white/25
                      "
                    />
                  )
            }


            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  truncate
                  text-xs
                  font-medium
                  text-white/70
                "
              >
                {
                  loading &&
                  uploadStatus
                    ?
                    uploadStatus
                    :
                    tracks.length === 0
                      ?
                      "Add tracks to continue"
                      :
                      incompleteTrackCount > 0
                        ?
                        `${readyTrackCount} ready · ${incompleteTrackCount} need attention`
                        :
                        `${tracks.length} ${tracks.length === 1 ? "track" : "tracks"} ready`
                }
              </p>


              {
                !loading &&
                tracks.length > 0
                &&
                (
                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      text-white/25
                    "
                  >
                    {
                      publishMode ===
                        "scheduled"
                        ?
                        "Scheduled release"
                        :
                        "Publishing immediately"
                    }
                  </p>
                )
              }

            </div>

          </div>


          <button
            type="button"

            onClick={
              handleCreate
            }

            disabled={
              loading
            }

            className="
              flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white
              px-6
              py-3
              text-sm
              font-semibold
              text-black
              transition-all
              hover:bg-white/90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {
              loading
                ?
                (
                  <>
                    <Loader2
                      size={16}
                      className="
                        animate-spin
                      "
                    />

                    Uploading...
                  </>
                )
                :
                (
                  <>
                    <UploadCloud
                      size={16}
                    />

                    {
                      publishMode ===
                        "scheduled"
                        ?
                        "Schedule Release"
                        :
                        "Create Release"
                    }
                  </>
                )
            }

          </button>

        </div>

      </div>

    </div>

  );

}


// ========================================================
// SECTION HEADING
// ========================================================

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-4
      "
    >

      <span
        className="
          mt-1
          font-mono
          text-[10px]
          text-white/20
        "
      >
        {
          number
        }
      </span>


      <div>

        <h2
          className="
            text-lg
            font-semibold
            tracking-[-0.02em]
          "
        >
          {
            title
          }
        </h2>


        <p
          className="
            mt-1
            text-sm
            text-white/35
          "
        >
          {
            description
          }
        </p>

      </div>

    </div>

  );

}


// ========================================================
// FIELD LABEL
// ========================================================

function FieldLabel({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {

  return (

    <div>

      <div
        className="
          mb-2
          flex
          items-center
          gap-2
        "
      >

        <label
          className="
            text-xs
            font-medium
            text-white/55
          "
        >
          {
            label
          }
        </label>


        {
          optional
          &&
          (
            <span
              className="
                text-[10px]
                text-white/20
              "
            >
              Optional
            </span>
          )
        }

      </div>


      {
        children
      }

    </div>

  );

}


// ========================================================
// PUBLISH OPTION
// ========================================================

function PublishOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
}: {
  active: boolean;
  icon: typeof Calendar;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {

  return (

    <button
      type="button"

      disabled={
        disabled
      }

      onClick={
        onClick
      }

      className={`
        group
        relative
        rounded-xl
        border
        p-4
        text-left
        transition-all

        ${
          active
            ?
            `
              border-purple-400/35
              bg-purple-500/[0.07]
            `
            :
            `
              border-white/[0.08]
              bg-white/[0.02]
              hover:border-white/[0.14]
              hover:bg-white/[0.035]
            `
        }
      `}
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            gap-3
          "
        >

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border

              ${
                active
                  ?
                  `
                    border-purple-400/20
                    bg-purple-500/10
                    text-purple-200
                  `
                  :
                  `
                    border-white/[0.07]
                    bg-white/[0.03]
                    text-white/30
                  `
              }
            `}
          >

            <Icon
              size={16}
            />

          </div>


          <div>

            <p
              className="
                text-sm
                font-medium
                text-white/85
              "
            >
              {
                title
              }
            </p>


            <p
              className="
                mt-1
                text-xs
                leading-5
                text-white/30
              "
            >
              {
                description
              }
            </p>

          </div>

        </div>


        <div
          className={`
            mt-1
            flex
            h-4
            w-4
            shrink-0
            items-center
            justify-center
            rounded-full
            border

            ${
              active
                ?
                `
                  border-white
                  bg-white
                `
                :
                `
                  border-white/15
                `
            }
          `}
        >

          {
            active
            &&
            (
              <Check
                size={10}
                strokeWidth={4}
                className="
                  text-black
                "
              />
            )
          }

        </div>

      </div>

    </button>

  );

}


// ========================================================
// TRACK STATUS
// ========================================================

type TrackStatus =
  | "ready"
  | "title"
  | "genre"
  | "audio";


function getTrackStatus(
  track: Track
): TrackStatus {

  if (
    !track.file
  ) {

    return "audio";

  }


  if (
    !track.title.trim()
  ) {

    return "title";

  }


  if (
    !track.genre.trim()
  ) {

    return "genre";

  }


  return "ready";

}


function TrackStatusBadge({
  status,
}: {
  status: TrackStatus;
}) {

  if (
    status ===
    "ready"
  ) {

    return (

      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-emerald-500/[0.08]
          px-2
          py-1
          text-[10px]
          font-medium
          text-emerald-300/80
        "
      >

        <CheckCircle2
          size={11}
        />

        Ready

      </span>

    );

  }


  const label =
    status === "title"
      ?
      "Needs title"
      :
      status === "genre"
        ?
        "Needs genre"
        :
        "Needs audio";


  return (

    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-amber-500/[0.08]
        px-2
        py-1
        text-[10px]
        font-medium
        text-amber-300/75
      "
    >

      <AlertCircle
        size={11}
      />

      {
        label
      }

    </span>

  );

}


// ========================================================
// GENRE DROPDOWN
// ========================================================

function GenreDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  disabled?: boolean;
}) {

  const [
    open,
    setOpen,
  ] =
    useState(false);


  return (

    <div
      className="
        relative
        z-50
      "
    >

      <button
        type="button"

        disabled={
          disabled
        }

        onClick={() =>
          setOpen(
            prev => !prev
          )
        }

        className={`
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          border
          px-4
          py-3.5
          text-left
          text-sm
          outline-none
          transition-all

          ${
            open
              ?
              `
                border-purple-400/40
                bg-white/[0.055]
                ring-4
                ring-purple-500/[0.05]
              `
              :
              `
                border-white/[0.08]
                bg-white/[0.035]
                hover:border-white/[0.14]
                hover:bg-white/[0.05]
              `
          }
        `}
      >

        <span
          className={
            value
              ?
              "truncate text-white/85"
              :
              "truncate text-white/25"
          }
        >
          {
            value ||
            "Select genre"
          }
        </span>


        <ChevronDown
          size={15}

          className={`
            shrink-0
            text-white/25
            transition-transform
            duration-200

            ${
              open
                ?
                "rotate-180"
                :
                ""
            }
          `}
        />

      </button>


      <AnimatePresence>

        {
          open &&
          !disabled
          &&
          (

            <>
              <button
                type="button"

                aria-label="Close genre menu"

                onClick={() =>
                  setOpen(
                    false
                  )
                }

                className="
                  fixed
                  inset-0
                  z-[300]
                  cursor-default
                "
              />


              <motion.div
                initial={{
                  opacity:
                    0,
                  y:
                    -6,
                  scale:
                    0.99,
                }}

                animate={{
                  opacity:
                    1,
                  y:
                    0,
                  scale:
                    1,
                }}

                exit={{
                  opacity:
                    0,
                  y:
                    -6,
                  scale:
                    0.99,
                }}

                transition={{
                  duration:
                    0.14,
                }}

                className="
                  absolute
                  left-0
                  top-full
                  z-[400]
                  mt-2
                  max-h-[420px]
                  w-full
                  overflow-y-auto
                  rounded-xl
                  border
                  border-white/[0.09]
                  bg-[#101010]/95
                  p-2
                  shadow-2xl
                  shadow-black/70
                  backdrop-blur-2xl
                "
              >

                {
                  genreGroups.map(
                    group => (

                      <div
                        key={
                          group.label
                        }

                        className="
                          py-1
                          first:pt-0
                          last:pb-0
                        "
                      >

                        <p
                          className="
                            px-3
                            pb-1.5
                            pt-2
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-white/20
                          "
                        >
                          {
                            group.label
                          }
                        </p>


                        <div
                          className="
                            space-y-0.5
                          "
                        >

                          {
                            group.genres.map(
                              genre => {

                                const active =
                                  value ===
                                  genre;


                                return (

                                  <button
                                    key={
                                      genre
                                    }

                                    type="button"

                                    onClick={() => {

                                      onChange(
                                        genre
                                      );


                                      setOpen(
                                        false
                                      );

                                    }}

                                    className={`
                                      flex
                                      w-full
                                      items-center
                                      justify-between
                                      rounded-lg
                                      px-3
                                      py-2.5
                                      text-left
                                      text-xs
                                      transition

                                      ${
                                        active
                                          ?
                                          `
                                            bg-white
                                            text-black
                                          `
                                          :
                                          `
                                            text-white/55
                                            hover:bg-white/[0.055]
                                            hover:text-white
                                          `
                                      }
                                    `}
                                  >

                                    <span>
                                      {
                                        genre
                                      }
                                    </span>


                                    {
                                      active
                                      &&
                                      (
                                        <Check
                                          size={13}
                                          strokeWidth={3}
                                        />
                                      )
                                    }

                                  </button>

                                );

                              }
                            )
                          }

                        </div>

                      </div>

                    )
                  )
                }

              </motion.div>
            </>

          )
        }

      </AnimatePresence>

    </div>

  );

}


// ========================================================
// DURATION
// ========================================================

function formatDuration(
  seconds: number
) {

  const mins =
    Math.floor(
      seconds / 60
    );


  const secs =
    Math.floor(
      seconds % 60
    );


  return `${mins}:${secs
    .toString()
    .padStart(
      2,
      "0"
    )}`;

}