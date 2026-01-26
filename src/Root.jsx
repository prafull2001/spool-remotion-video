import React from "react";
import { Composition } from "remotion";
import { CleanHypeReel } from "./CleanHypeReel.jsx";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={CleanHypeReel}
        durationInFrames={900} // 30 seconds at 30fps (intro + ticker + 3 stat slides + CTA)
        fps={30}
        width={1080}  // 9:16 vertical aspect ratio
        height={1920}
      />
    </>
  );
};
