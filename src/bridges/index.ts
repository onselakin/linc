/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';

const actions = { ...labActions, ...storeActions };
export default actions;
