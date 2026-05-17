import type { PhilosophyVideo } from "./philosophyVideoTypes";
import { PHILOSOPHER_VIDEO_TAG_PATCH } from "./philosopherVideoTags";

export function mergePhilosopherVideoTags(
  videos: PhilosophyVideo[],
): PhilosophyVideo[] {
  return videos.map((video) => {
    const extra = PHILOSOPHER_VIDEO_TAG_PATCH[video.id];
    if (!extra?.length) return video;
    const philosopherIds = [
      ...new Set([...(video.philosopherIds ?? []), ...extra]),
    ];
    return { ...video, philosopherIds };
  });
}
