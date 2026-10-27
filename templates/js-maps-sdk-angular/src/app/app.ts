import type { OnInit } from "@angular/core";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

// Optional: If you're loading secure web maps
// import { configureOAuth } from "../auth/configureOAuth";
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
import SimpleLineSymbol from "@geoscene/core/symbols/SimpleLineSymbol.js";
import SimpleMarkerSymbol from "@geoscene/core/symbols/SimpleMarkerSymbol.js";
import type WebMap from "@geoscene/core/WebMap.js";
import type { GeoSceneMap } from "@geoscene/map-components/components/geoscene-map";

@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App implements OnInit {
  title = "map-components-angular-sample";
  navHeading = "";
  navDescription = "";
  ngOnInit(): void {
    console.log("OnInit");
  }

  GeoSceneViewReadyChange(event: CustomEvent): void {
    const viewElement = event.target as GeoSceneMap;

    // Use metadata from the Web Map to populate the header
    const map = viewElement.map as WebMap;
    const portalItem = map.portalItem;
    const title = portalItem?.title ? portalItem.title : "A web map";
    const description = portalItem?.description ? portalItem.description : "GeoScene Maps SDK for JavaScript template";

    this.navHeading = title;
    this.navDescription = description;

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
    const markerSymbol = new SimpleMarkerSymbol({
      style: "triangle",
      size: 20,
      color: "red",
      outline,
    });

    // Create a graphic and add the geometry and symbol to it
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });

    // Add a graphic to demonstrate custom visualizations beyond Web Map content
    viewElement.graphics.add(pointGraphic);
  }
}
