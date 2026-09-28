import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { parseWebVideo, webVideoScript } from '../../src/web-viewer';

test('validates untrusted video metadata and strips injected translations', () => {
  const input = { url: 'https://example.com/watch', title: 'Video', token: 'x', currentTime: 0, segments: [{start: 0, duration: 2, text: 'Caption', translation: 'untrusted'}] };
  assert.equal(parseWebVideo(input)?.segments[0].text, 'Caption');
  assert.equal('translation' in parseWebVideo(input)!.segments[0], false);
  assert.equal(parseWebVideo({...input, url: 'javascript:alert(1)'}), undefined);
  assert.equal(parseWebVideo({...input, segments: [{start: 0, duration: Infinity, text: 'x'}]}), undefined);
});

test('playback refuses stale page, replaced source and detached video', async () => {
  const video = { isConnected: true, currentSrc: 'media', currentTime: 2 };
  const state = { video, token: 'token', url: 'https://example.com/', source: 'media' };
  const context = { window: { __contextualReaderVideo: state }, location: { href: state.url } };
  assert.equal(await runInNewContext(webVideoScript('token', 'time'), context), 2);
  await runInNewContext(webVideoScript('token', 'seekTo', 5), context);
  assert.equal(video.currentTime, 5);
  await assert.rejects(runInNewContext(webVideoScript('wrong', 'time'), context), /changed/);
  video.currentSrc = 'replacement';
  await assert.rejects(runInNewContext(webVideoScript('token', 'time'), context), /changed/);
  video.currentSrc = 'media'; video.isConnected = false;
  await assert.rejects(runInNewContext(webVideoScript('token', 'time'), context), /changed/);
  assert.throws(() => webVideoScript('token', 'seekTo', NaN), /Invalid/);
});
