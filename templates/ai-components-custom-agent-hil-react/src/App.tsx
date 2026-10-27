import "./index.css";

import React, { useState } from "react";

// Individual imports for each component used in this sample
import "@geoscene/map-components/components/geoscene-map";
import "@geoscene/map-components/components/geoscene-zoom";
import "@geoscene/map-components/components/geoscene-legend";
import "@geoscene/map-components/components/geoscene-search";
import "@geoscene/map-components/components/geoscene-expand";

import "@geoscene/calcite-components/dist/components/calcite-shell";
import "@geoscene/calcite-components/dist/components/calcite-panel";
import "@geoscene/calcite-components/dist/components/calcite-shell-panel";
import "@geoscene/calcite-components/dist/components/calcite-button";

import "@geoscene/ai-components/components/geoscene-assistant";
import "@geoscene/ai-components/components/geoscene-assistant-agent";
import "@geoscene/ai-components/components/geoscene-assistant-navigation-agent";
import "@geoscene/ai-components/components/geoscene-assistant-data-exploration-agent";

import type { GeoSceneMap } from "@geoscene/map-components/components/geoscene-map";

// Core API import
import WebMap from "@geoscene/core/WebMap.js";
import MapView from "@geoscene/core/views/MapView.js";

import { ServiceMaintenanceAgent } from "./maintenanceAgent";

function App(): React.JSX.Element {
  const map = new WebMap({
    portalItem: {
      id: "394f946eac284ce0b5a93fdc194c5430",
    },
  });

  const [mapView, setMapView] = useState<MapView | null>(null);

  const handleViewReady = (event: CustomEvent): void => {
    const viewElement = event.target as GeoSceneMap;
    const view = viewElement.view;
    setMapView(view);
  };

  return (
    <calcite-shell>
      <calcite-shell-panel slot="panel-end" width="l" id="assistant-panel">
        <calcite-panel>
          {mapView && (
            <geoscene-assistant
              reference-element="#main-map"
              heading="Road maintenance service requests"
              description="This map displays reported road maintenance issues in the city."
              entryMessage="Use the assistant to log new maintenance issues or explore existing service requests."
              suggestedPrompts={[
                "Go to the Palm Springs Convention Center",
                "The median road paint has faded. Should be repainted in the next maintenance cycle.",
                "There is a pothole about 3 feet wide and 6 inches deep at the corner of Tahquitz Canyon Way and Palm Canyon Drive.",
              ]}
              ongeosceneSubmit={(event) => {
                console.log("geoscene submit: ", event.detail);
              }}
            >
              <geoscene-assistant-navigation-agent></geoscene-assistant-navigation-agent>
              <geoscene-assistant-data-exploration-agent></geoscene-assistant-data-exploration-agent>
              <geoscene-assistant-agent
                agent={ServiceMaintenanceAgent}
                context={{
                  mapView,
                }}
              ></geoscene-assistant-agent>
              <calcite-button
                slot="footer-content"
                label="Clear map graphics"
                icon-start="clear-selection"
                onClick={() => {
                  mapView?.graphics.removeAll();
                }}
              >
                Clear map graphics
              </calcite-button>
            </geoscene-assistant>
          )}
        </calcite-panel>
      </calcite-shell-panel>
      <geoscene-map id="main-map" map={map} ongeosceneViewReadyChange={handleViewReady}>
        <geoscene-zoom slot="top-left"></geoscene-zoom>
        <geoscene-expand slot="top-left">
          <geoscene-search></geoscene-search>
        </geoscene-expand>
        <geoscene-expand slot="top-left">
          <geoscene-legend></geoscene-legend>
        </geoscene-expand>
      </geoscene-map>
    </calcite-shell>
  );
}

export default App;
