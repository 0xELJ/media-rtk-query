import { useAddAlbumMutation, useFetchAlbumsQuery } from "../store";
import Skeleton from "./Skeleton";
import Button from "./Button";
import AlbumListItem from "./AlbumListItem";

function AlbumsList({ user }) {
  /**
   * data: The data returned from the server.
   * error: Error, if one occurred.
   * isLoading: True if currently loading data for the first time only.
   * isFetching: True if currently fetching data.
   * refetch: function tell the query to rerun, fetching new data.
   */
  const { data, error, isLoading, isFetching, refetch, ...rest } = useFetchAlbumsQuery(user);
  const [addAlbum, results] = useAddAlbumMutation();

  function handleAddAlbum() {
    addAlbum(user);
  }

  function renderContent() {
    if (isFetching) {
      return <Skeleton className="h-10 w-full" times={3} />;
    } else if (error) {
      return <div>Error loading albums.</div>
    } else {
      return data.map(album => {
        return (
          <AlbumListItem 
            key={album.id}
            album={album}
          />
        )
      });
    }
  }

  return (
    <div>
      <div className="m-2 flex flex-row items center justify-between">
        <h3 className="text-lg font-bold">Albums for {user.name}</h3>
        <Button onClick={handleAddAlbum} loading={results.isLoading}>
          + Add Album
        </Button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}

export default AlbumsList;
