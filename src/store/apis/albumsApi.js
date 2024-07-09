import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';
import { pause } from '../thunks/fetchUsers';

/**
 * createApi is the core of RTK Query. It allows to define a set of endpoints that describe how to
 * retrieve data from backend APIs and other async resources, including the configuration of how to 
 * fetch and transform the data.
 * 
 * It generates an API Slice structure that contains Redux logic (and optionally React Hooks) that encapsulate
 * the data fetching logic.
 */
const albumsApi = createApi({
    reducerPath: 'albums', // the path in the global state where the API data will be stored
    /**
     * RTK uses the Fetch API under the hook to make the actual HTTP requests. 
     * baseQuery property accepts a fetchBaseQuery function that returns another function that will be used to make the requests.
     * fetchBaseQuery is a function that configures the behavior of the fetch requests.
     */
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005',
        // REMOVE FOR PRODUCTION
        fetchFn: async (...args) => {
            await pause(1000);
            return fetch(...args)
        }
    }),
    /**
     * endpoints is a function that accepts a builder object that contains methods to describe the API calls.
     * 
     * @param {*} builder The builder object has methods to define queries, mutations, and subscriptions.
     * @returns object with the defined endpoints, where each key is the name that will be used for the auto generated hooks.
     */
    endpoints(builder) {
        return {
            fetchAlbums: builder.query({
                // providesTags: ['Album'],
                providesTags(result, error, user) {
                    const tags = result.map(album => {
                        return { type: 'Album', id: album.id };
                    });
                    tags.push({ type: 'UsersAlbum', id: user.id });
                    return tags;
                },
                query(user) {
                    return {
                        method: 'GET',
                        url: '/albums',
                        params: {
                            userId: user.id
                        }
                    }
                }
            }),
            addAlbum: builder.mutation({
                // invalidatesTags: ['Album'],
                invalidatesTags(result, error, user) {
                    return [{ type: 'UsersAlbum', id: user.id }]
                },
                query(user) {
                    return {
                        method: 'POST',
                        url: '/albums',
                        body: {
                            userId: user.id,
                            title: faker.commerce.productName()
                        }
                    }
                }
            }),
            removeAlbum: builder.mutation({
                invalidatesTags(result, error, album) {
                    return [{ type: 'Album', id: album.id }]
                },
                query(album) {
                    return {
                        method: 'DELETE',
                        url: '/albums/' + album.id,
                    }
                }
            })
        }
    }
});

export { albumsApi };
export const { useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation } = albumsApi;
