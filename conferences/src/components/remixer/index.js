import { Provider } from 'react-redux';

import Remixer from './Remixer';
import { store } from './store';

const RemixerWrapper = props => (
  <Provider store={store}>
    <Remixer {...props} />
  </Provider>
);

export default RemixerWrapper;
