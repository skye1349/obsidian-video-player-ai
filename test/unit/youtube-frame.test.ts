import assert from "node:assert/strict";
import test from "node:test";
import {
  YOUTUBE_FRAME_FORMAT,
  videoFrameCaptureErrorMessage,
  buildYouTubeFrameFfmpegArgs
} from "../../src/youtube-frame";

test("YouTube frame capture requests a video-only stream before muxed fallbacks", () => {
  assert.equal(
    YOUTUBE_FRAME_FORMAT,
    "bestvideo[height<=1080]/best[height<=1080]/bestvideo/best"
  );
});

test("YouTube frame capture maps only video and disables caption-bearing streams", () => {
  const args = buildYouTubeFrameFfmpegArgs(
    "https://video.example/stream",
    69.25,
    "/tmp/frame.png"
  );

  assert.deepEqual(args.slice(args.indexOf("-map"), args.indexOf("-frames:v")), [
    "-map",
    "0:v:0",
    "-an",
    "-sn",
    "-dn"
  ]);
  assert.deepEqual(args.slice(args.indexOf("-frames:v"), args.indexOf("-vf")), [
    "-frames:v",
    "1"
  ]);
  assert.equal(args.at(-1), "/tmp/frame.png");
});


test("capture errors do not flood notices with signed media URLs", () => {
  const error = new Error("Error opening input https://video.example/playback?sig=private Server returned 403 Forbidden");
  const message = videoFrameCaptureErrorMessage(error);
  assert.match(message, /403/);
  assert.doesNotMatch(message, /private|https:/);
  assert.ok(message.length < 220);
  assert.doesNotMatch(videoFrameCaptureErrorMessage(new Error("Failed https://video.example/?token=private")), /private|https:/);
});
