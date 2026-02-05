import React from "react";
import { Audio, Sequence, staticFile, interpolate } from "remotion";

// ============================================
// SOUND EFFECTS COMPONENTS
// Source: github.com/rse/soundfx (CC0/Public Domain)
// ============================================

// Whoosh sound for slide transitions
export const WhooshSFX = ({ frame, volume = 0.5 }) => (
  <Sequence from={frame} durationInFrames={30}>
    <Audio src={staticFile("sounds/whoosh.mp3")} volume={volume} />
  </Sequence>
);

// Click sound for typing effect
export const ClickSFX = ({ frame, volume = 0.3 }) => (
  <Sequence from={frame} durationInFrames={15}>
    <Audio src={staticFile("sounds/click.mp3")} volume={volume} />
  </Sequence>
);

// Pop sound for card appearances
export const PopSFX = ({ frame, volume = 0.4 }) => (
  <Sequence from={frame} durationInFrames={15}>
    <Audio src={staticFile("sounds/pop.mp3")} volume={volume} />
  </Sequence>
);

// Chime sound for success/CTA moments
export const ChimeSFX = ({ frame, volume = 0.6 }) => (
  <Sequence from={frame} durationInFrames={90}>
    <Audio src={staticFile("sounds/chime.mp3")} volume={volume} />
  </Sequence>
);

// Bling sound for impact/dramatic moments
export const BlingSFX = ({ frame, volume = 0.7 }) => (
  <Sequence from={frame} durationInFrames={90}>
    <Audio src={staticFile("sounds/bling.mp3")} volume={volume} />
  </Sequence>
);

// Slide sound for subtle transitions
export const SlideSFX = ({ frame, volume = 0.4 }) => (
  <Sequence from={frame} durationInFrames={30}>
    <Audio src={staticFile("sounds/slide.mp3")} volume={volume} />
  </Sequence>
);

// Batch of transition sounds for all slide changes
export const TransitionSounds = ({ transitionFrames, volume = 0.5 }) => (
  <>
    {transitionFrames.map((frame, i) => (
      <WhooshSFX key={`whoosh-${i}`} frame={frame} volume={volume} />
    ))}
  </>
);

// Batch of pop sounds for card animations (with slight volume variation)
export const CardPopSounds = ({ cardFrames, baseVolume = 0.35 }) => (
  <>
    {cardFrames.map((frame, i) => (
      <PopSFX
        key={`pop-${i}`}
        frame={frame}
        volume={baseVolume + (Math.random() * 0.1 - 0.05)} // Slight variation
      />
    ))}
  </>
);
