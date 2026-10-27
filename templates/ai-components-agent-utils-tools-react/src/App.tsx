import "./index.css";

import React, { useRef } from "react";

// Individual imports for each component used in this sample
import "@geoscene/map-components/components/geoscene-map";
import "@geoscene/map-components/components/geoscene-zoom";
import "@geoscene/map-components/components/geoscene-legend";
import "@geoscene/map-components/components/geoscene-expand";

import "@geoscene/calcite-components/components/calcite-shell";
import "@geoscene/calcite-components/components/calcite-panel";
import "@geoscene/calcite-components/components/calcite-shell-panel";

import "@geoscene/ai-components/components/geoscene-assistant";
import "@geoscene/ai-components/components/geoscene-assistant-agent";
import "@geoscene/ai-components/components/geoscene-assistant-navigation-agent";

import type { GeoSceneMap } from "@geoscene/map-components/components/geoscene-map";

// Core API import
import WebMap from "@geoscene/core/WebMap.js";

import { NetworkAnalysisAgent } from "./networkAnalysisAgent";

function App(): React.JSX.Element {
  const map = new WebMap({
    portalItem: {
      id: "957e1e4d26994e8ca34248e45067f4b9",
    },
  });
  const mapElementRef = useRef<GeoSceneMap | null>(null);

  return (
    <calcite-shell>
      <calcite-shell-panel slot="panel-end" width="l" id="assistant-panel">
        <calcite-panel>
          <geoscene-assistant
            reference-element="#main-map"
            heading="Walk and drive times"
            description="Use the chat below to calculate drive times and walking distances to understand the accessibility of different locations."
            entryMessage="You must first navigate to a location on the map using the navigation agent before asking about drive times or walking distances."
            suggestedPrompts={[
              "Go to the Palm Springs convention center",
              "How far can I get in 10 minutes walking from the convention center?",
            ]}
            log-enabled
            keep-suggested-prompts
          >
            <geoscene-assistant-navigation-agent></geoscene-assistant-navigation-agent>
            <geoscene-assistant-agent
              agent={NetworkAnalysisAgent}
              context={async () => {
                const mapElement = mapElementRef.current!;
                await mapElement.componentOnReady();
                await mapElement.viewOnReady();
                return {
                  mapElement,
                };
              }}
            ></geoscene-assistant-agent>
          </geoscene-assistant>
        </calcite-panel>
      </calcite-shell-panel>
      <geoscene-map id="main-map" ref={mapElementRef} map={map}>
        <geoscene-zoom slot="top-left"></geoscene-zoom>
        <geoscene-expand slot="top-left">
          <geoscene-legend></geoscene-legend>
        </geoscene-expand>
      </geoscene-map>
    </calcite-shell>
  );
}

export default App;
