import * as Sentry from '@sentry/nextjs';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // From https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc, also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
  ignoreErrors: [
    /^No error$/,
    /__show__deepen/,
    /_avast_submit/,
    /Access is denied/,
    /anonymous function: captureException/,
    /Blocked a frame with origin/,
    /console is not defined/,
    /cordova/,
    /DataCloneError/,
    /Error: AccessDeny/,
    /event is not defined/,
    /feedConf/,
    /ibFindAllVideos/,
    /myGloFrameList/,
    /SecurityError/,
    /MyIPhoneApp/,
    /snapchat.com/,
    /vid_mate_check is not defined/,
    /win\.document\.body/,
    /window\._sharedData\.entry_data/,
    /ztePageScrollModule/,
  ],
  denyUrls: [],
});
