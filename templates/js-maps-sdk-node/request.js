#!/usr/bin/env node

import geosceneConfig from "@geoscene/core/config.js";
import geosceneRequest from "@geoscene/core/request.js";

geosceneConfig.request.useIdentity = false;

const url = "https://www.geosceneonline.cn/geoscene/sharing/rest";

geosceneRequest(url, {
  query: {
    f: "json",
  },
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
