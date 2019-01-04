# OliPass

OliPass is a work-in-progress password manager that doesn't depend on any server.

Instead, it allows you to export/import the encrypted database as a file, so you can keep your devices synchronized or save your own backups somewhere else.

## Getting Started

This project is a React Native app, mainly targeted for Android, written in Typescript.

### Prerequisites

You'll need react-native installed with its dependencies to build native projects (without expo).

The following steps will be using yarn, but you can use npm as well.

### Installing

Install dependencies

```
yarn
```

Start typescript compiler - This will keep watching for changes in `src/` and output JS to `build/`

```
yarn start
```

Start react-native packager

```
yarn packager
```

Then run it on your device

```
yarn android
```

## Running the tests

TBD

```
yarn test
```

## Built With
* [React](https://reactjs.org/) - The library for building interfaces.
* [Redux](https://redux.js.org/) - The state manager.
* [Redux-Saga](https://redux-saga.js.org/) - The side effects orchestrator.
* [React Native](https://facebook.github.io/react-native/) - The app container.
* [Realm Database](https://realm.io/products/realm-database) - Database to store encrypted data.
* [CryptoJS](https://code.google.com/p/crypto-js/) - Encryption library for imports/exports.

## Authors

* **Victor Oliva** - *Initial work* - [voliva](https://github.com/voliva)

## Planned upgrades
- [ ] Add support for fingerprint login
- [ ] Synchronize via GDrive or similar
- [ ] Improve visuals
- [ ] Improve iOS support
- [ ] Desktop version

## Disclaimer

Although this project is actively looking for ways to make it safer, specially as it's dealing with really sensitive data, it's still experimental and not up to the standards yet. This project nor its contributors are responsible for any data loss, leaked or any other damage the usage of this app could have caused.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

We kindly ask to credit the original authors of this project when publishing any derivative work.
