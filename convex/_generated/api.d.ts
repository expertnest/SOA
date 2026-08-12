/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _seed_seedSingle from "../_seed/seedSingle.js";
import type * as addTotalReplays from "../addTotalReplays.js";
import type * as admin from "../admin.js";
import type * as artistAnalytics from "../artistAnalytics.js";
import type * as artistComparison from "../artistComparison.js";
import type * as artists from "../artists.js";
import type * as createProjectWithSongs from "../createProjectWithSongs.js";
import type * as createSong from "../createSong.js";
import type * as deepAnalytics from "../deepAnalytics.js";
import type * as events from "../events.js";
import type * as feed from "../feed.js";
import type * as fixSongs from "../fixSongs.js";
import type * as http from "../http.js";
import type * as mutations_events_songEnd from "../mutations/events/songEnd.js";
import type * as mutations_events_songLike from "../mutations/events/songLike.js";
import type * as mutations_events_songPlay from "../mutations/events/songPlay.js";
import type * as mutations_events_songReplay from "../mutations/events/songReplay.js";
import type * as mutations_events_songSkip from "../mutations/events/songSkip.js";
import type * as projects from "../projects.js";
import type * as songAnalytics from "../songAnalytics.js";
import type * as songStats from "../songStats.js";
import type * as songs from "../songs.js";
import type * as stats from "../stats.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_seed/seedSingle": typeof _seed_seedSingle;
  addTotalReplays: typeof addTotalReplays;
  admin: typeof admin;
  artistAnalytics: typeof artistAnalytics;
  artistComparison: typeof artistComparison;
  artists: typeof artists;
  createProjectWithSongs: typeof createProjectWithSongs;
  createSong: typeof createSong;
  deepAnalytics: typeof deepAnalytics;
  events: typeof events;
  feed: typeof feed;
  fixSongs: typeof fixSongs;
  http: typeof http;
  "mutations/events/songEnd": typeof mutations_events_songEnd;
  "mutations/events/songLike": typeof mutations_events_songLike;
  "mutations/events/songPlay": typeof mutations_events_songPlay;
  "mutations/events/songReplay": typeof mutations_events_songReplay;
  "mutations/events/songSkip": typeof mutations_events_songSkip;
  projects: typeof projects;
  songAnalytics: typeof songAnalytics;
  songStats: typeof songStats;
  songs: typeof songs;
  stats: typeof stats;
  storage: typeof storage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
