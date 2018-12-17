export interface Preference {
  github: {
    accessToken: null | string;
    host: null | string;
    pathPrefix: string;
    webHost: null | string;
    interval: number;
    https: boolean;
  };
  general: {
    browser: null | any; // FIXME
    notification: boolean;
    notificationSilent: boolean;
    onlyUnreadIssue: boolean;
    badge: boolean;
    alwaysOpenOutdated: boolean;
    alwaysOpenExternalUrlInExternalBrowser: boolean;
  };
  theme: {
    main: null | any; // FIXME
    browser: null | any; // FIXME
  };
  database: {
    path: string;
    max: number;
  };
}
