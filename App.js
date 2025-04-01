import React from 'react';
import AppNavigator from './src/Navigation/AppNavigtor';
import { persistor, store } from './src/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

// const App = () => {
//   return <AppNavigator />;
// };
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};
export default App;
