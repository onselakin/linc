import githubActions from './github';
import storeActions from './store';

const actions = { ...githubActions, ...storeActions };
export default actions;
