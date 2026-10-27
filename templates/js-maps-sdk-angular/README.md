# GeoScene Maps SDK for JavaScript Angular template

📁 **[Click here to download this directory as a ZIP file](https://github/geoscene/jsapi-resources/zips/js-maps-sdk-angular.zip)** 📁

This template demonstrates how to use the [GeoScene Maps SDK for JavaScript](https://doc.geoscene.cn/javascript/latest/) in a Angular application.

> [!TIP]
> **Angular 22** Angular 22 introduces a new chunk optimization strategy that may produce a substantially different build output than Angular 21. In testing with this sample application, Angular 22 generated fewer chunks, changed startup bundle composition, and produced different Lighthouse performance results.
>
> If you want a build output that more closely resembles Angular 21, add the following build script to your package.json:
>
> `"build-faster": "NG_BUILD_OPTIMIZE_CHUNKS=0 ng build --configuration production"`
> Performance characteristics vary by application. Be sure to benchmark your build times and runtime performance before and after enabling this workaround.

## Get started

To quickly scaffold a new application using this template, run the following command in your terminal:

```bash
npx @geoscene/create -n my-geoscene-app -t angular
```

This template uses the following packages:

- [`@geoscene/core`](https://www.npmjs.com/package/@geoscene/core)
- [`@geoscene/map-components`](https://www.npmjs.com/package/@geoscene/map-components)
- [`@geoscene/charts-components`](https://www.npmjs.com/package/@geoscene/charts-components)
- [`@geoscene/calcite-components`](https://www.npmjs.com/package/@geoscene/calcite-components)

## Known issues

- Compile warnings for SDK dependencies on npm packages using CommonJS or AMD is a known issue and can be ignored. For the list of warnings being suppressed, see this project's `angular.json` file, under `allowedCommonJsDependencies`.

## Resources

See the [Get started with npm guide](https://doc.geoscene.cn/javascript/latest/get-started/#use-geoscenecreate) for full instructions.
