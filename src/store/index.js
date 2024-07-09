import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { usersReducer } from './slices/usersSlice';
import { albumsApi} from './apis/albumsApi';
import { photosApi } from './apis/photosApi';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    [albumsApi.reducerPath]: albumsApi.reducer,
    [photosApi.reducerPath]: photosApi.reducer,
  },
  /**
   * The albumsApi slice also contains a custom middleware that is used to handle the API requests.
   * Adding the custom api middleware enables caching, invalidation, polling, and other features of RTK Query.
   * 
   * middleware is a function that accepts a getDefaultMiddleware function and returns an array of middlewares.
   * 
   * @param {function} getDefaultMiddleware 
   * @returns array of middlewares
   */
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(albumsApi.middleware)
      .concat(photosApi.middleware);
  },
});

/**
 * 
 * setupListeners is an utility function used to enable refetchOnFocus and refetchOnReconnect features.
 */
setupListeners(store.dispatch);

export * from './thunks/fetchUsers';
export * from './thunks/addUser';
export * from './thunks/removeUser';
export { useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation } from './apis/albumsApi';
export { useFetchPhotosQuery, useAddPhotoMutation, useRemovePhotoMutation } from './apis/photosApi';
