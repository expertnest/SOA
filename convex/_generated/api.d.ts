/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as artistAnalytics from "../artistAnalytics.js";
import type * as artistComparison from "../artistComparison.js";
import type * as artists from "../artists.js";
import type * as createProjectWithSongs from "../createProjectWithSongs.js";
import type * as deepAnalytics from "../deepAnalytics.js";
import type * as events from "../events.js";
import type * as feed from "../feed.js";
import type * as http from "../http.js";
import type * as legacy_addTotalReplays from "../legacy/addTotalReplays.js";
import type * as legacy_admin from "../legacy/admin.js";
import type * as legacy_createSong from "../legacy/createSong.js";
import type * as legacy_fixSongs from "../legacy/fixSongs.js";
import type * as legacy_seedSingle from "../legacy/seedSingle.js";
import type * as legacy_stats from "../legacy/stats.js";
import type * as projects from "../projects.js";
import type * as saveListenRanges from "../saveListenRanges.js";
import type * as songAnalytics from "../songAnalytics.js";
import type * as songStats from "../songStats.js";
import type * as songs from "../songs.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  artistAnalytics: typeof artistAnalytics;
  artistComparison: typeof artistComparison;
  artists: typeof artists;
  createProjectWithSongs: typeof createProjectWithSongs;
  deepAnalytics: typeof deepAnalytics;
  events: typeof events;
  feed: typeof feed;
  http: typeof http;
  "legacy/addTotalReplays": typeof legacy_addTotalReplays;
  "legacy/admin": typeof legacy_admin;
  "legacy/createSong": typeof legacy_createSong;
  "legacy/fixSongs": typeof legacy_fixSongs;
  "legacy/seedSingle": typeof legacy_seedSingle;
  "legacy/stats": typeof legacy_stats;
  projects: typeof projects;
  saveListenRanges: typeof saveListenRanges;
  songAnalytics: typeof songAnalytics;
  songStats: typeof songStats;
  songs: typeof songs;
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
