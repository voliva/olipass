watchman watch-del-all
rm -Rf node_modules
yarn
rm -Rf /tmp/metro* /tmp/haste*
yarn start --reset-cache
