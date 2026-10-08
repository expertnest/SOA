import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

type CatalogType =

  | "single"

  | "album"

  | "ep"

  | "mixtape";

// ==============================

// CATALOG HELPERS

// ==============================

function getCatalogPrefix(

  type: CatalogType

) {

  switch (type) {

    case "single":

      return "S";

    case "album":

      return "ALB";

    case "ep":

      return "EP";

    case "mixtape":

      return "MIX";

  }

}

async function getNextCatalogNumber(

  ctx: any,

  type: CatalogType

) {

  const now = Date.now();

  const existingCounter =

    await ctx.db

      .query("catalogCounters")

      .withIndex(

        "by_type",

        (q: any) =>

          q.eq("type", type)

      )

      .unique();

  let nextNumber = 1;

  if (existingCounter) {

    nextNumber =

      existingCounter.currentNumber + 1;

    await ctx.db.patch(

      existingCounter._id,

      {

        currentNumber: nextNumber,

        updatedAt: now,

      }

    );

  } else {

    await ctx.db.insert(

      "catalogCounters",

      {

        type,

        currentNumber: nextNumber,

        updatedAt: now,

      }

    );

  }

  const prefix =

    getCatalogPrefix(type);

  const paddedNumber =

    String(nextNumber).padStart(

      3,

      "0"

    );

  return `SOA-${prefix}-${paddedNumber}`;

}

// ==============================

// GET CURRENT USER

// ==============================

async function getCurrentUser(

  ctx: any

) {

  const identity =

    await ctx.auth.getUserIdentity();

  if (!identity) {

    throw new Error(

      "Not authenticated"

    );

  }

  const user = await ctx.db

    .query("users")

    .withIndex(

      "by_clerkId",

      (q: any) =>

        q.eq(

          "clerkId",

          identity.subject

        )

    )

    .unique();

  if (!user) {

    throw new Error(

      "User not found"

    );

  }

  return user;

}

// ==============================

// REQUIRE ARTIST WRITE ACCESS

// ==============================

async function requireArtistWriteAccess(

  ctx: any,

  artistId: any

) {

  const user =

    await getCurrentUser(ctx);

  // SOA platform admin can manage

  // every artist.

  if (

    user.platformRole === "admin"

  ) {

    return user;

  }

  const membership = await ctx.db

    .query("artistMembers")

    .withIndex(

      "by_artist_user",

      (q: any) =>

        q

          .eq(

            "artistId",

            artistId

          )

          .eq(

            "userId",

            user._id

          )

    )

    .unique();

  if (

    !membership ||

    !membership.isActive

  ) {

    throw new Error(

      "You do not have access to this artist"

    );

  }

  if (

    membership.role !== "owner" &&

    membership.role !== "admin" &&

    membership.role !== "manager"

  ) {

    throw new Error(

      "You do not have permission to manage releases"

    );

  }

  return user;

}

// ==============================

// CREATE PROJECT

// ==============================

export const createProject =

  mutation({

    args: {

      name: v.string(),

      artistId:

        v.id("artists"),

      description:

        v.optional(

          v.string()

        ),

      coverImage:

        v.optional(

          v.string()

        ),

      type: v.optional(

        v.union(

          v.literal("single"),

          v.literal("album"),

          v.literal("ep"),

          v.literal("mixtape"),

          v.literal("draft")

        )

      ),

      releaseDate:

        v.optional(

          v.number()

        ),

    },

    handler: async (

      ctx,

      args

    ) => {

      await requireArtistWriteAccess(

        ctx,

        args.artistId

      );

      const artist =

        await ctx.db.get(

          args.artistId

        );

      if (!artist) {

        throw new Error(

          "Artist not found"

        );

      }

      const now = Date.now();

      const projectType =

        args.type ?? "draft";

      let catalogNumber:

        | string

        | undefined;

      if (

        projectType !== "draft"

      ) {

        catalogNumber =

          await getNextCatalogNumber(

            ctx,

            projectType

          );

      }

      const projectId =

        await ctx.db.insert(

          "projects",

          {

            name:

              args.name,

            artistId:

              args.artistId,

            isActive:

              false,

            description:

              args.description,

            coverImage:

              args.coverImage,

            catalogNumber,

            type:

              projectType,

            releaseDate:

              args.releaseDate,

            createdAt:

              now,

            totalPlays:

              0,

          }

        );

      return {

        projectId,

        catalogNumber,

      };

    },

  });

// ==============================

// GET PROJECTS BY ARTIST

// ==============================

export const getProjectsByArtist =

  query({

    args: {

      artistId:

        v.id("artists"),

    },

    handler: async (

      ctx,

      args

    ) => {

      return await ctx.db

        .query("projects")

        .withIndex(

          "by_artistId",

          (q) =>

            q.eq(

              "artistId",

              args.artistId

            )

        )

        .collect();

    },

  });

// ==============================
// GET PUBLIC SIDEBAR LIBRARY
// ==============================
//
// Public listening-browser data.
//
// Shape:
//
// artists
//   -> projects
//      -> tracks
//
// plus a global trending list.
//
// IMPORTANT:
// - only active artists
// - only active/public projects
// - only active songs
// - preserves projectSongs track order
// - unlinked active songs fall into a
//   synthetic "Singles" collection
//
// This lets SidebarLibrary use the real
// projects + projectSongs tables instead
// of guessing projects from song.projectName.
// ==============================

export const getSidebarLibrary = query({
  handler: async (ctx) => {
    const [
      artistDocs,
      projectDocs,
      projectSongDocs,
      songDocs,
      statDocs,
    ] = await Promise.all([
      ctx.db.query("artists").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("projectSongs").collect(),
      ctx.db.query("songs").collect(),
      ctx.db.query("song_stats").collect(),
    ]);

    const activeArtists =
      artistDocs.filter(
        (artist) => artist.isActive
      );

    const activeArtistIds =
      new Set(
        activeArtists.map(
          (artist) =>
            artist._id.toString()
        )
      );

    const publicProjects =
      projectDocs.filter(
        (project) =>
          project.isActive &&
          project.type !== "draft" &&
          activeArtistIds.has(
            project.artistId.toString()
          )
      );

    const publicProjectIds =
      new Set(
        publicProjects.map(
          (project) =>
            project._id.toString()
        )
      );

    const publicSongs =
      songDocs.filter(
        (song) =>
          song.isActive &&
          activeArtistIds.has(
            song.artistId.toString()
          )
      );

    const songMap = new Map(
      publicSongs.map((song) => [
        song._id.toString(),
        song,
      ])
    );

    const projectMap = new Map(
      publicProjects.map((project) => [
        project._id.toString(),
        project,
      ])
    );

    const artistMap = new Map(
      activeArtists.map((artist) => [
        artist._id.toString(),
        artist,
      ])
    );

    const statsMap = new Map(
      statDocs.map((stat) => [
        stat.songId.toString(),
        stat,
      ])
    );

    const publicLinks =
      projectSongDocs.filter(
        (link) =>
          publicProjectIds.has(
            link.projectId.toString()
          ) &&
          songMap.has(
            link.songId.toString()
          )
      );

    const linksByProject =
      new Map<string, typeof publicLinks>();

    const linksBySong =
      new Map<string, typeof publicLinks>();

    for (const link of publicLinks) {
      const projectKey =
        link.projectId.toString();

      const songKey =
        link.songId.toString();

      const projectLinks =
        linksByProject.get(
          projectKey
        ) ?? [];

      projectLinks.push(link);

      linksByProject.set(
        projectKey,
        projectLinks
      );

      const songLinks =
        linksBySong.get(
          songKey
        ) ?? [];

      songLinks.push(link);

      linksBySong.set(
        songKey,
        songLinks
      );
    }

    const toTrack = (
      song: (typeof publicSongs)[number],
      options?: {
        projectId?: string | null;
        projectName?: string | null;
        projectType?: string | null;
        projectCoverImage?: string | null;
        trackNumber?: number | null;
      }
    ) => {
      const artist =
        artistMap.get(
          song.artistId.toString()
        );

      const stat =
        statsMap.get(
          song._id.toString()
        );

      return {
        songId:
          song._id,

        title:
          song.title,

        artistId:
          song.artistId,

        artistName:
          artist?.name ??
          "Unknown Artist",

        coverImage:
          song.coverImage ??
          options?.projectCoverImage ??
          "/assets/soalogo.png",

        duration:
          song.duration,

        audioUrl:
          song.audioUrl,

        genre:
          song.genre,

        totalPlays:
          stat?.totalPlays ??
          song.totalPlays ??
          0,

        skipRate:
          stat?.skipRate ??
          song.skipRate ??
          0,

        replayRate:
          stat?.replayRate ??
          song.replayRate ??
          0,

        projectId:
          options?.projectId ??
          null,

        projectName:
          options?.projectName ??
          null,

        projectType:
          options?.projectType ??
          null,

        projectCoverImage:
          options?.projectCoverImage ??
          null,

        trackNumber:
          options?.trackNumber ??
          null,
      };
    };

    const artists =
      activeArtists
        .map((artist) => {
          const artistProjects =
            publicProjects
              .filter(
                (project) =>
                  project.artistId ===
                  artist._id
              )
              .map((project) => {
                const links =
                  [
                    ...(
                      linksByProject.get(
                        project._id.toString()
                      ) ?? []
                    ),
                  ].sort(
                    (a, b) =>
                      a.trackNumber -
                      b.trackNumber
                  );

                const tracks =
                  links
                    .map((link) => {
                      const song =
                        songMap.get(
                          link.songId.toString()
                        );

                      if (!song) {
                        return null;
                      }

                      if (
                        song.artistId !==
                        artist._id
                      ) {
                        return null;
                      }

                      return toTrack(
                        song,
                        {
                          projectId:
                            project._id.toString(),

                          projectName:
                            project.name,

                          projectType:
                            project.type,

                          projectCoverImage:
                            project.coverImage ??
                            null,

                          trackNumber:
                            link.trackNumber,
                        }
                      );
                    })
                    .filter(
                      (
                        track
                      ): track is NonNullable<
                        typeof track
                      > =>
                        track !== null
                    );

                return {
                  projectKey:
                    project._id.toString(),

                  projectId:
                    project._id.toString() as string | null,

                  name:
                    project.name,

                  type:
                    project.type,

                  coverImage:
                    project.coverImage ??
                    tracks[0]
                      ?.coverImage ??
                    "/assets/soalogo.png",

                  releaseDate:
                    project.releaseDate ??
                    null,

                  tracks,
                };
              })
              .filter(
                (project) =>
                  project.tracks.length >
                  0
              )
              .sort((a, b) => {
                const aDate =
                  a.releaseDate ?? 0;

                const bDate =
                  b.releaseDate ?? 0;

                return bDate - aDate;
              });

          const artistSongIds =
            new Set(
              artistProjects.flatMap(
                (project) =>
                  project.tracks.map(
                    (track) =>
                      track.songId.toString()
                  )
              )
            );

          const unlinkedSongs =
            publicSongs.filter(
              (song) =>
                song.artistId ===
                  artist._id &&
                !artistSongIds.has(
                  song._id.toString()
                )
            );

          const unlinkedTracks =
            unlinkedSongs
              .map((song) =>
                toTrack(song)
              )
              .sort(
                (a, b) =>
                  b.totalPlays -
                  a.totalPlays
              );

          const projects =
            [...artistProjects];

          if (
            unlinkedTracks.length >
            0
          ) {
            projects.push({
              projectKey:
                `unlinked:${artist._id.toString()}`,

              projectId:
                null,

              name:
                "Singles",

              type:
                "single",

              coverImage:
                unlinkedTracks[0]
                  ?.coverImage ??
                artist.image ??
                "/assets/soalogo.png",

              releaseDate:
                null,

              tracks:
                unlinkedTracks,
            });
          }

          const popularTracks =
            projects
              .flatMap(
                (project) =>
                  project.tracks
              )
              .sort(
                (a, b) =>
                  b.totalPlays -
                  a.totalPlays
              )
              .slice(0, 8);

          return {
            artistId:
              artist._id,

            name:
              artist.name,

            slug:
              artist.slug,

            image:
              artist.image ??
              popularTracks[0]
                ?.coverImage ??
              "/assets/soalogo.png",

            projects,

            popularTracks,
          };
        })
        .filter(
          (artist) =>
            artist.projects.length >
              0 ||
            artist.popularTracks.length >
              0
        );

    const trending =
      publicSongs
        .map((song) => {
          const songLinks =
            linksBySong.get(
              song._id.toString()
            ) ?? [];

          const firstPublicLink =
            songLinks[0];

          const project =
            firstPublicLink
              ? projectMap.get(
                  firstPublicLink
                    .projectId
                    .toString()
                )
              : undefined;

          return toTrack(
            song,
            {
              projectId:
                project?._id.toString() ??
                null,

              projectName:
                project?.name ??
                null,

              projectType:
                project?.type ??
                null,

              projectCoverImage:
                project?.coverImage ??
                null,

              trackNumber:
                firstPublicLink
                  ?.trackNumber ??
                null,
            }
          );
        })
        .sort(
          (a, b) =>
            b.totalPlays -
            a.totalPlays
        )
        .slice(0, 10);

    return {
      artists,
      trending,
    };
  },
});

// ==============================

// GET SINGLE PUBLIC PROJECT

// ==============================

export const getProject = query({

  args: {

    projectId: v.id("projects"),

  },

  handler: async (

    ctx,

    { projectId }

  ) => {

    // ======================

    // GET PROJECT

    // ======================

    const project =

      await ctx.db.get(projectId);

    // Project does not exist

    if (!project) {

      return null;

    }

    // ======================

    // PUBLIC RELEASE GUARD

    // ======================

    // Public callers should never

    // receive drafts/unpublished releases.

    if (!project.isActive) {

      return null;

    }

    // ======================

    // PROJECT SONG LINKS

    // ======================

    const links =

      await ctx.db

        .query("projectSongs")

        .withIndex(

          "by_projectId",

          (q) =>

            q.eq(

              "projectId",

              projectId

            )

        )

        .collect();

    // ======================

    // ACTIVE PUBLIC TRACKS

    // ======================

    const tracks =

      await Promise.all(

        links.map(

          async (link) => {

            const song =

              await ctx.db.get(

                link.songId

              );

            if (!song) {

              return null;

            }

            // Do not expose

            // inactive songs publicly.

            if (!song.isActive) {

              return null;

            }

            // Integrity check:

            // song must belong to

            // the same artist.

            if (

              song.artistId !==

              project.artistId

            ) {

              return null;

            }

            return {

              ...song,

              trackNumber:

                link.trackNumber,

            };

          }

        )

      );

    // ======================

    // RETURN PUBLIC RELEASE

    // ======================

    return {

      ...project,

      tracks: tracks

        .filter(

          (track) =>

            track !== null

        )

        .sort(

          (a, b) =>

            a!.trackNumber -

            b!.trackNumber

        ),

    };

  },

});

// ==============================

// UPDATE PROJECT

// ==============================

export const updateProject =

  mutation({

    args: {

      projectId:

        v.id("projects"),

      name:

        v.optional(

          v.string()

        ),

      description:

        v.optional(

          v.string()

        ),

      coverImage:

        v.optional(

          v.string()

        ),

      releaseDate:

        v.optional(

          v.number()

        ),

      catalogNumber:

        v.optional(

          v.string()

        ),

      type: v.optional(

        v.union(

          v.literal("single"),

          v.literal("album"),

          v.literal("ep"),

          v.literal("mixtape"),

          v.literal("draft")

        )

      ),

    },

    handler: async (

      ctx,

      args

    ) => {

      const project =

        await ctx.db.get(

          args.projectId

        );

      if (!project) {

        throw new Error(

          "Project not found"

        );

      }

      await requireArtistWriteAccess(

        ctx,

        project.artistId

      );

      const {

        projectId,

        ...updates

      } = args;

      await ctx.db.patch(

        projectId,

        updates

      );

      return projectId;

    },

  });

// ==============================

// PUBLISH PROJECT

// ==============================

export const publishProject =

  mutation({

    args: {

      projectId:

        v.id("projects"),

    },

    handler: async (

      ctx,

      args

    ) => {

      // ==========================

      // GET PROJECT

      // ==========================

      const project =

        await ctx.db.get(

          args.projectId

        );

      if (!project) {

        throw new Error(

          "Project not found."

        );

      }

      // ==========================

      // AUTHORIZE

      // ==========================

      await requireArtistWriteAccess(

        ctx,

        project.artistId

      );

      // ==========================

      // VALIDATE RELEASE TYPE

      // ==========================

      if (

        project.type === "draft"

      ) {

        throw new Error(

          "Draft projects need a release type before publishing."

        );

      }

      // ==========================

      // GET LINKED SONGS

      // ==========================

      const links =

        await ctx.db

          .query("projectSongs")

          .withIndex(

            "by_projectId",

            (q) =>

              q.eq(

                "projectId",

                args.projectId

              )

          )

          .collect();

      if (

        links.length === 0

      ) {

        throw new Error(

          "A release must contain at least one song before publishing."

        );

      }

      // ==========================

      // VALIDATE + ACTIVATE SONGS

      // ==========================

      for (

        const link of links

      ) {

        const song =

          await ctx.db.get(

            link.songId

          );

        if (!song) {

          throw new Error(

            "A linked song could not be found."

          );

        }

        if (

          song.artistId !==

          project.artistId

        ) {

          throw new Error(

            "A linked song belongs to a different artist."

          );

        }

        await ctx.db.patch(

          song._id,

          {

            isActive: true,

          }

        );

      }

      // ==========================

      // ACTIVATE PROJECT

      // ==========================

      await ctx.db.patch(

        args.projectId,

        {

          isActive: true,

        }

      );

      return {

        success: true,

      };

    },

  });

  export const getArtistProjectsForDashboard = query({

    args: {

      artistId: v.id("artists"),

    },

    handler: async (ctx, { artistId }) => {

      // ======================

      // CURRENT USER

      // ======================

      const user =

        await getCurrentUser(ctx);

      // ======================

      // AUTHORIZE

      // ======================

      if (

        user.platformRole !== "admin"

      ) {

        const membership =

          await ctx.db

            .query("artistMembers")

            .withIndex(

              "by_artist_user",

              q =>

                q

                  .eq(

                    "artistId",

                    artistId

                  )

                  .eq(

                    "userId",

                    user._id

                  )

            )

            .unique();

        if (

          !membership ||

          !membership.isActive

        ) {

          throw new Error(

            "You do not have access to this artist"

          );

        }

      }

      // ======================

      // PROJECTS

      // ======================

      const projects =

        await ctx.db

          .query("projects")

          .withIndex(

            "by_artistId",

            q =>

              q.eq(

                "artistId",

                artistId

              )

          )

          .collect();

      // ======================

      // TRACK COUNTS

      // ======================

      const results =

        await Promise.all(

          projects.map(

            async project => {

              const links =

                await ctx.db

                  .query(

                    "projectSongs"

                  )

                  .withIndex(

                    "by_projectId",

                    q =>

                      q.eq(

                        "projectId",

                        project._id

                      )

                  )

                  .collect();

              return {

                ...project,

                trackCount:

                  links.length,

              };

            }

          )

        );

      // Newest first

      return results.sort(

        (a, b) =>

          b.createdAt -

          a.createdAt

      );

    },

  });

  // ==============================

// GET ARTIST PROJECT FOR DASHBOARD

// ==============================

export const getArtistProjectForDashboard = query({

  args: {

    projectId: v.id("projects"),

  },

  handler: async (ctx, { projectId }) => {

    // ======================

    // CURRENT USER

    // ======================

    const user =

      await getCurrentUser(ctx);

    // ======================

    // PROJECT

    // ======================

    const project =

      await ctx.db.get(projectId);

    if (!project) {

      return null;

    }

    // ======================

    // AUTHORIZE

    // ======================

    if (

      user.platformRole !== "admin"

    ) {

      const membership =

        await ctx.db

          .query("artistMembers")

          .withIndex(

            "by_artist_user",

            (q) =>

              q

                .eq(

                  "artistId",

                  project.artistId

                )

                .eq(

                  "userId",

                  user._id

                )

          )

          .unique();

      if (

        !membership ||

        !membership.isActive

      ) {

        throw new Error(

          "You do not have access to this release"

        );

      }

    }

    // ======================

    // PROJECT SONG LINKS

    // ======================

    const links =

      await ctx.db

        .query("projectSongs")

        .withIndex(

          "by_projectId",

          (q) =>

            q.eq(

              "projectId",

              projectId

            )

        )

        .collect();

    // ======================

    // TRACKS

    // ======================

    const tracks =

      await Promise.all(

        links.map(

          async (link) => {

            const song =

              await ctx.db.get(

                link.songId

              );

            if (!song) {

              return null;

            }

            // Extra integrity check

            if (

              song.artistId !==

              project.artistId

            ) {

              return null;

            }

            return {

              ...song,

              trackNumber:

                link.trackNumber,

            };

          }

        )

      );

    // ======================

    // RETURN

    // ======================

    return {

      ...project,

      tracks: tracks

        .filter(

          (track) =>

            track !== null

        )

        .sort(

          (a, b) =>

            a!.trackNumber -

            b!.trackNumber

        ),

    };

  },

});
