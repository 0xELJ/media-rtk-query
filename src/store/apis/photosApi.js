import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker'

const photosApi = createApi({
    reducerPath: 'photos',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005'
    }),
    endpoints(builder) {
        return {
            fetchPhotos: builder.query({
                providesTags(photoList, error, album) {
                    const tags = photoList.map(photo => {
                        return { type: 'Photo', id: photo.id };
                    });
                    tags.push({ type: 'AlbumsPhoto', id: album.id });
                    return tags;
                },
                query(album) {
                    return {
                        method: 'GET',
                        url: '/photos',
                        params: {
                            albumId: album.id
                        }
                    }
                }
            }),
            addPhoto: builder.mutation({
                invalidatesTags(result, error, album) {
                    return [{ type: 'AlbumsPhoto', id: album.id }]
                },
                query(album) {
                    return {
                        method: 'POST',
                        url: '/photos',
                        body: {
                            url: faker.image.abstract(150, 150, true),
                            albumId: album.id
                        }
                    };
                }
            }),
            removePhoto: builder.mutation({
                invalidatesTags(result, error, photo) {
                    return [{ type: 'Photo', id: photo.id }]
                },
                query(photo) {
                    return {
                        method: 'DELETE',
                        url: '/photos/' + photo.id
                    };
                }
            })
        }
    }
});

export { photosApi };
export const { useFetchPhotosQuery, useAddPhotoMutation, useRemovePhotoMutation } = photosApi;