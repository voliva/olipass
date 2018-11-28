# OliPass

OliPass is a work-in-progress password manager that doesn't depend on any server.

Instead, it allows you to export/import the encrypted database as a file, so you can keep your devices synchronized or save your own backups somewhere else.

## Getting Started

At the current state, this project is based on [expo-cli](https://github.com/expo/expo-cli) (previously known as create-react-native-app).

It may get ejected soon when we start adding native modules.

### Prerequisites

You'll need expo-cli installed with its dependencies.

The following steps will be using yarn, but you can use npm as well.

### Installing

Install dependencies

```
yarn
```

Start typescript compiler + expo packager

```
yarn start
```

## Running the tests

```
yarn test
```

## Built With
* [React](https://reactjs.org/) - The library for building interfaces.
* [Redux](https://redux.js.org/) - The state manager.
* [Redux-Saga](https://redux-saga.js.org/) - The side effects orchestrator.
* [React Native](https://facebook.github.io/react-native/) - The app container.
* [Realm Database](https://realm.io/products/realm-database) - (WIP Planning to use this one) Database to store encrypted data.
* [CryptoJS](https://code.google.com/p/crypto-js/) - Encryption library for imports/exports.

## Authors

* **Victor Oliva** - *Initial work* - [voliva](https://github.com/voliva)

## Disclaimer

Although this project is actively looking for ways to make it safer, specially as it's dealing with really sensitive data, it's still experimental and not up to the standards yet. This project nor its contributors are responsible for any data loss, leaked or any other damage the usage of this app could have caused.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
