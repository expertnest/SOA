import { Id } from "@/convex/_generated/dataModel";

export type SongFeedItem = {
  songId: Id<"songs">;
  title: string;
  artistName: string;
  coverImage: string;
  duration: number;

  totalPlays: number;
  skipRate: number;
  replayRate: number;
};