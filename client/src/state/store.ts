import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'; // Correct import
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as the storage engine
import rootReducer from './reducers'; // Your combined reducers

const persistConfig = {
    key: 'root',
    storage, // Use localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Apply middleware directly
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
