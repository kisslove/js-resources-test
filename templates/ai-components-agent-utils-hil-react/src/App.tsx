import "./index.css";

import React, { useRef, useState } from "react";

// Individual imports for each component used in this sample
import "@geoscene/map-components/components/geoscene-map";
import "@geoscene/map-components/components/geoscene-zoom";
import "@geoscene/map-components/components/geoscene-legend";
import "@geoscene/map-components/components/geoscene-search";
import "@geoscene/map-components/components/geoscene-expand";

import "@geoscene/calcite-components/components/calcite-shell";
import "@geoscene/calcite-components/components/calcite-panel";
import "@geoscene/calcite-components/components/calcite-shell-panel";
import "@geoscene/calcite-components/components/calcite-button";

//import calcite table* for md formatting in assistant response
import "@geoscene/calcite-components/components/calcite-table";
import "@geoscene/calcite-components/components/calcite-table-row";
import "@geoscene/calcite-components/components/calcite-table-header";
import "@geoscene/calcite-components/components/calcite-table-cell";

import "@geoscene/ai-components/components/geoscene-assistant";
import "@geoscene/ai-components/components/geoscene-assistant-agent";
import "@geoscene/ai-components/components/geoscene-assistant-navigation-agent";
import "@geoscene/ai-components/components/geoscene-assistant-data-exploration-agent";

import type { GeoSceneMap } from "@geoscene/map-components/components/geoscene-map";

// Core API import
import WebMap from "@geoscene/core/WebMap.js";

import { ServiceMaintenanceAgent } from "./maintenanceAgent";
import type { GeoSceneAssistant } from "@geoscene/ai-components/components/geoscene-assistant";

function App(): React.JSX.Element {
  const map = new WebMap({
    portalItem: {
      id: "394f946eac284ce0b5a93fdc194c5430",
    },
  });

  const mapElementRef = useRef<GeoSceneMap | null>(null);
  const assistantElementRef = useRef<GeoSceneAssistant | null>(null);

  return (
    <calcite-shell>
      <calcite-shell-panel slot="panel-end" width="l" id="assistant-panel">
        <calcite-panel>
          <geoscene-assistant
            reference-element="#main-map"
            ref={assistantElementRef}
            heading="道路养护服务请求"
            description="此地图显示城市中已上报的道路养护问题。"
            entry-message="使用助手登记新的养护问题，或浏览现有的服务请求。"
            keep-suggested-prompts
            suggestedPrompts={[
              "前往棕榈泉会议中心",
              "道路中央隔离带的标线漆已经褪色，应该在下一个养护周期重新粉刷。",
              "Tahquitz Canyon Way 与 Palm Canyon Drive 路口拐角处有一个约 3 英尺宽、6 英寸深的坑洞。",
            ]}
            ongeosceneSubmit={(event) => {
              console.log("geoscene submit: ", event.detail);
            }}
          >
            <geoscene-assistant-navigation-agent></geoscene-assistant-navigation-agent>
            <geoscene-assistant-data-exploration-agent></geoscene-assistant-data-exploration-agent>
            <geoscene-assistant-agent
              agent={ServiceMaintenanceAgent}
              context={async () => {
                const mapElement = mapElementRef.current!;
                await mapElement.componentOnReady();
                await mapElement.viewOnReady();
                return {
                  mapElement,
                };
              }}
            ></geoscene-assistant-agent>
            <calcite-button
              slot="footer-content"
              label="重置聊天记录"
              icon-start="reset"
              onClick={() => {
                mapElementRef.current!.graphics.removeAll();
                assistantElementRef.current!.clearChatHistory();
              }}
            >
              重置聊天记录
            </calcite-button>
          </geoscene-assistant>
        </calcite-panel>
      </calcite-shell-panel>
      <geoscene-map id="main-map" map={map} ref={mapElementRef}>
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
