import geosceneConfig from "@geoscene/core/config.js";
import geosceneId from "@geoscene/core/identity/IdentityManager.js";
import OAuthInfo from "@geoscene/core/identity/OAuthInfo.js";

// If popup is set to true, you'll need to implement oauth callback logic manually
// See: https://github.com/geoscene/jsapi-resources/tree/main/oauth
export function configureOAuth({ portalUrl, appId, popup = false }) {
  if (portalUrl) {
    geosceneConfig.portalUrl = portalUrl;
  }

  const oAuthInfo = portalUrl
    ? new OAuthInfo({
        appId,
        portalUrl,
        popup,
      })
    : new OAuthInfo({
        appId,
        popup,
      });

  geosceneId.registerOAuthInfos([oAuthInfo]);
}
