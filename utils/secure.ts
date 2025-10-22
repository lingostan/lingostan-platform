import * as Keychain from "react-native-keychain";

const ACCESS_SERVICE = "lingostan.access";
const REFRESH_SERVICE = "lingostan.refresh";

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await Keychain.setGenericPassword("access", accessToken, {
    service: ACCESS_SERVICE,
  });
  await Keychain.setGenericPassword("refresh", refreshToken, {
    service: REFRESH_SERVICE,
  });
};

export const getAccessToken = async (): Promise<string | null> => {
  const creds = await Keychain.getGenericPassword({ service: ACCESS_SERVICE });
  if (creds === false) {
    throw new Error("No refresh token found");
  }

  return creds?.password || null;
};

export const getRefreshToken = async (): Promise<string | null> => {
  const creds = await Keychain.getGenericPassword({ service: REFRESH_SERVICE });

  if (creds === false) {
    throw new Error("No refresh token found");
  }

  return creds?.password || null;
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({ service: ACCESS_SERVICE });
  await Keychain.resetGenericPassword({ service: REFRESH_SERVICE });
};
