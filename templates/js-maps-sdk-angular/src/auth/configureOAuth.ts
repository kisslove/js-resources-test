import geosceneConfig from "@geoscene/core/config.js";
import geosceneId from "@geoscene/core/identity/IdentityManager.js";
import OAuthInfo from "@geoscene/core/identity/OAuthInfo.js";

export interface OAuthConfig {
  portalUrl?: string;
  appId: string;
  // If true, you'll need to implement oauth callback logic manually
  // See: https://github.com/geoscene/jsapi-resources/tree/main/oauth
  popup?: boolean;
}

export function configureOAuth({ portalUrl, appId, popup = false }: OAuthConfig): void {
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
