import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({
    name: 'Courtly',
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect();