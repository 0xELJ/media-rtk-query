import ExpandablePanel from "./ExpandablePanel";
import Button from "./Button";
import { GoTrashcan } from "react-icons/go";
import { useRemoveAlbumMutation } from "../store";
import PhotosList from "./PhotosList";

export default function AlbumListItem({ album }) {
  const [removeAlbum, removeResults] = useRemoveAlbumMutation();
  
  function handleDeleteAlbum() {
    removeAlbum(album);
  }
  
  const header = (
    <>
      <Button className="mr-2" loading={removeResults.isLoading}>
        <GoTrashcan onClick={handleDeleteAlbum} />
      </Button>
      {album.title}
    </>
  );

  return (
    <ExpandablePanel key={album.id} header={header}>
      <PhotosList album={album} />
    </ExpandablePanel>
  )
}