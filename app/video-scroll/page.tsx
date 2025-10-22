import { Suspense } from "react";
import VideoScrollFeed from "@/components/VideoScrollFeed";

export default function VideoScrollPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoScrollFeed />
    </Suspense>
  );
}
