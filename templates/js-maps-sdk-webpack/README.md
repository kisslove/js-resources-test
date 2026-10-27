# GeoScene Maps SDK for JavaScript Webpack template

📁 **[Click here to download this directory as a ZIP file](https://github/geoscene/jsapi-resources/zips/js-maps-sdk-webpack.zip)** 📁

This template demonstrates how to use the [GeoScene Maps SDK for JavaScript](https://doc.geoscene.cn/javascript/latest/) in a Webpack application.

## Get started

To quickly scaffold a new application using this template, run the following command in your terminal:

```bash
npx @geoscene/create -n my-geoscene-app -t webpack
```

This template uses the following packages:

- [`@geoscene/core`](https://www.npmjs.com/package/@geoscene/core)
- [`@geoscene/map-components`](https://www.npmjs.com/package/@geoscene/map-components)
- [`@geoscene/charts-components`](https://www.npmjs.com/package/@geoscene/charts-components)
- [`@geoscene/calcite-components`](https://www.npmjs.com/package/@geoscene/calcite-components)

## Optional debugging

If you notice hard-to-read stack traces or browser warnings about missing source maps, you can install and enable [source-map-loader](https://v4.webpack.js.org/loaders/source-map-loader/) for better debugging (e.g. `npm i -D source-map-loader`).

```mjs
// webpack.config.mjs
const config = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: ["source-map-loader"],
      },
      ...
    ],
  }
};
```

## Resources

See the [Get started with npm guide](https://doc.geoscene.cn/javascript/latest/get-started/#use-geoscenecreate) for full instructions.
