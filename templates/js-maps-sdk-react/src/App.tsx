import { useState } from "react";

// Optional: If you're loading secure web maps
// import { configureOAuth } from "./auth/configureOAuth";
// configureOAuth({
//   // Default portalUrl is GeoScene Online
//   // Only set if using other portals
//   portalUrl: "YOUR_PORTAL_URL",
//   appId: "YOUR_APP_ID",
// });

// Individual imports for each Map, Chart and Calcite component
import "@geoscene/map-components/components/geoscene-expand";
import "@geoscene/map-components/components/geoscene-legend";
import "@geoscene/map-components/components/geoscene-map";
import "@geoscene/map-components/components/geoscene-search";
import "@geoscene/map-components/components/geoscene-zoom";
import "@geoscene/charts-components/components/geoscene-chart";
import "@geoscene/calcite-components/components/calcite-shell";
import "@geoscene/calcite-components/components/calcite-navigation";
import "@geoscene/calcite-components/components/calcite-navigation-logo";

// Import modules and types from the SDK's core API
import Graphic from "@geoscene/core/Graphic.js";
import Point from "@geoscene/core/geometry/Point.js";
import SimpleMarkerSymbol from "@geoscene/core/symbols/SimpleMarkerSymbol.js";
import SimpleLineSymbol from "@geoscene/core/symbols/SimpleLineSymbol.js";
import type WebMap from "@geoscene/core/WebMap.js";

export function App(): React.JSX.Element {
  const [navHeading, setNavHeading] = useState("");
  const [navDescription, setNavDescription] = useState("");

  const handleViewReady = (event: CustomEvent): void => {
    const viewElement = event.target as HTMLGeoSceneMapElement;

    // Use metadata from the Web Map to populate the header
    const map = viewElement.map as WebMap;
    const portalItem = map.portalItem;
    const title = portalItem?.title ? portalItem.title : "A web map";
    const description = portalItem?.description ? portalItem.description : "GeoScene Maps SDK for JavaScript template";

    setNavHeading(title);
    setNavDescription(description);

    // Define a point geometry
    const point = new Point({
      longitude: -98.38,
      latitude: 38.34,
    });

    // Create an outline for the marker symbol
    const outline = new SimpleLineSymbol({
      color: "white",
      width: 2,
    });

    // Create a symbol for drawing the point
    const symbol = new SimpleMarkerSymbol({
      style: "triangle",
      size: 20,
      color: "red",
      outline,
    });

    // Create a graphic and add the geometry and symbol to it
    const pointGraphic = new Graphic({
      geometry: point,
      symbol,
    });

    // Add a graphic to demonstrate custom visualizations beyond Web Map content
    viewElement.graphics.add(pointGraphic);
  };

  return (
    // The Shell component is used as a layout for this template
    <calcite-shell content-behind>
      <calcite-navigation slot="header">
        {/* Heading and description dynamically populated */}
        <calcite-navigation-logo
          heading={navHeading}
          description={navDescription}
          heading-level="1"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      {/* The Map component fits to the size of the parent element  */}
      {/* The basemap, extent, zoom and more are provided by the Web Map (item-id) */}
      {/* Note: popup-component-enabled enables the Popup component (beta). See https://doc.geoscene.cn/javascript/latest/references/map-components/components/geoscene-map/#popupComponentEnabled for details. */}
      <geoscene-map
        item-id="dd4b2f25487d4a37a45093ba6acd026d"
        popup-component-enabled
        ongeosceneViewReadyChange={handleViewReady}
      >
        <geoscene-zoom slot="top-left" />
        <geoscene-search slot="top-right" />
        <geoscene-expand slot="bottom-left">
          <geoscene-legend></geoscene-legend>
        </geoscene-expand>
        {/*  A Feature Layer in the Web Map has an associated chart (layer-item-id) */}
        <geoscene-chart
          layer-item-id="b1717962dab247ad93eaca257b32fe02"
          chart-index="1"
          slot="bottom-right"
        ></geoscene-chart>
      </geoscene-map>
    </calcite-shell>
  );
}
