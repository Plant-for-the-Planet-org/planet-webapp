#!/bin/sh

echo "Xcode version:"
xcodebuild -version
echo "Brew version:"
brew --version
echo "PATH:"
echo $PATH

# Install CocoaPods and npm using Homebrew.
echo "Install CocoaPods"
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
echo "Install npm"
brew install npm

echo "Pod version:"
pod --version
echo "Node version:"
node --version
echo "NPM version:"
npm --version
echo "PATH:"
echo $PATH

# Setting Environment Variables
pwd
cd ../../..
pwd
echo "MAPBOXGL_ACCESS_TOKEN=$MAPBOXGL_ACCESS_TOKEN" >> .env
echo "API_ENDPOINT=app.plant-for-the-planet.org" >> .env
echo "CDN_URL=cdn.plant-for-the-planet.org" >> .env
echo "SCHEME=https" >> .env
echo "CONFIG_URL=https://app.plant-for-the-planet.org/app/config" >> .env
echo "AUTH0_CUSTOM_DOMAIN=accounts.plant-for-the-planet.org" >> .env
echo "AUTH0_CLIENT_ID=6MME4DhfTZes2myvI0NXgWqGSIZdy0IH" >> .env
echo "NEXTAUTH_URL=org.pftp.app://www1.plant-for-the-planet.org" >> .env
echo "NEXT_PUBLIC_FEATURED_LIST=false" >> .env
echo "NEXT_PUBLIC_SENTRY_DSN=https://a1329275d6a4485e8e25a20859c0c642@o78291.ingest.sentry.io/5433504" >> .env
echo "SENTRY_ORG=plant-for-the-planet" >> .env
echo "SENTRY_PROJECT=app-20-next" >> .env
echo "SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN" >> .env
echo "TENANT=planet" >> .env
echo "TENANTID=ten_NxJq55pm" >> .env
echo "SITE_IMAGERY_API_URL=https://raster.plant-for-the-planet.org" >> .env
echo "WIDGET_URL=https://widgets.plant-for-the-planet.org" >> .env
echo "NEXT_PUBLIC_DONATION_URL=https://donate.plant-for-the-planet.org" >> .env
cp .env $ENV_FILENAME
echo "ENV_FILENAME is $ENV_FILENAME"
cat $ENV_FILENAME

# Install dependencies
echo "Running npm install"
npm install --legacy-peer-deps
echo "Running run build-mobile"
npm run build-mobile
