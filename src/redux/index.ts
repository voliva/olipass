import reducer from './reducer';
import Provider from './provider';

export type ApplicationState = ReturnType<typeof reducer>;
export { Provider }
