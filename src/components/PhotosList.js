import { useAddPhotoMutation, useFetchPhotosQuery } from "../store"
import Button from "./Button";
import Skeleton from './Skeleton';
import PhotosListItem from './PhotosListItem';

export default function PhotosList({ album }) {
    const photosList = useFetchPhotosQuery(album);
    const [addPhoto, newPhoto] = useAddPhotoMutation();

    function handleAddPhoto() {
        addPhoto(album);
    }

    function renderList() {
        if (photosList.isFetching) {
            return <Skeleton className="h-20 w-20 m-2" times={3} />
        } else if (photosList.error) {
            return <div>Error fetching photos.</div>
        } else {
            return photosList.data.map(photo => <PhotosListItem key={photo.id} photo={photo} />)
        }
    }

    return (
        <div>
            <div className="m-2 flex flex-row items-center justify-between">
                <h3 className="text-lg font-bold">Photos in {album.title}</h3>
                <Button onClick={handleAddPhoto} loading={newPhoto.isLoading}>
                    + Add Photo
                </Button>
            </div>
            <div className="mx-8 flex flex-row flex-wrap justify-center">
                {renderList()}
            </div>
        </div>
    );
}