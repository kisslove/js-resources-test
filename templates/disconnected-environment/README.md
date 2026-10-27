# Maps SDK components in a disconnected environment with Vite

📁 **[Click here to download this directory as a ZIP file](https://github/geoscene/jsapi-resources/zips/disconnected-environment.zip)** 📁

This project showcases [how to use the Maps SDK's components in a disconnected environment](https://doc.geoscene.cn/javascript/latest/working-with-assets/) with Vite, featuring the SDK's components and core API.

Any dependency of a package must be included in the `package.json` file and installed locally along with relevant assets.

## Tips for picking relevant assets

If you need more or less than this app provides, use DevTools network requests (`/assets/...`) to identify exactly which assets are required and adjust the copy scripts accordingly.
Once everything resolves, narrow the copy globs to only the asset folders your app actually requests.

## Get started

The project was created using Vite's [vanilla JavaScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vanilla)

Run `npm install` and then start adding modules.

For a list of all available `npm` commands see `scripts` in `package.json`, e.g. `npm run build`.
