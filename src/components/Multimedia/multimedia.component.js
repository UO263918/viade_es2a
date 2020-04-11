import React from "react";

import {
  MediaSectionWrapper,
  ScrollPanelMedia,
  ThumbnailContainer,
  ImageThumbnail,
  LinkMedia,
  MediaModal,
  SelectedImage,
  ImageContainer,
  DeleteConfirmation
} from "./multimedia.style";

import { modal, ModalCloseButton } from "@utils";
import { ConfirmationDialog } from '@components/Utils';
import { useTranslation } from "react-i18next";

const Multimedia = ({ files, onUpload, onMediaDelete, editable }) => {
  const validImageExtensions = "jpg jpeg png svg";

  const { t } = useTranslation();

  const [MediaViewModal, openMediaView, closeMediaView] = modal("route-map");
  const [MediaViewModalFile, openMediaViewFile, closeMediaViewFile] = modal("route-map");
  const [selectedMedia, setSelectedMedia] = React.useState(null);

  const [DeleteModal, openDelete, closeDelete] = modal("route-map");
  const [deleting, setDeleting] = React.useState(null);

  const openMediaViewWithImage = (link) => {
    setSelectedMedia(link);
    openMediaView();
  };

  const openMediaViewWithFile = (link) => {
    setSelectedMedia(link);
    openMediaViewFile();
  };

  const onDeleteResult = (result) => {
    closeDelete();
    if (result)
      onMediaDelete(deleting);
    setDeleting(null);
  };

  const onDeleteClick = (index) => {
    setDeleting(index);
    openDelete();
  };

  return (
    <MediaSectionWrapper>
      <MediaViewModal>
        <ModalCloseButton onClick={closeMediaViewFile} />
        <ImageContainer>
          <SelectedImage src={selectedMedia} onClick={closeMediaView} />
        </ImageContainer>
      </MediaViewModal>
      <MediaViewModalFile>
        <MediaModal>
          <ModalCloseButton onClick={closeMediaViewFile} />
          <h2>{t("route.file")}</h2>
          <p>
            {t("route.source")} {selectedMedia}
          </p>
          <p>{t("route.clickToDownload")}</p>
          <a href={selectedMedia} download>
            <img
              style={{ height: "2em" }}
              src="img/icon/download.svg"
              alt="download file"
            />
          </a>
        </MediaModal>
      </MediaViewModalFile>
      <ScrollPanelMedia>
        {editable && <ThumbnailContainer style={{ fontSize: '3em', cursor: 'default' }}>
          <label className="file-upload-label" htmlFor="upload-multimedia">
            🞤
          </label>
          <input
            id="upload-multimedia"
            type="file"
            onChange={(e) => onUpload(e.target.files)}
          />
        </ThumbnailContainer>}

        {files && files.map((f, index) => {
          var splitString = (f.name ? f.name : f["@id"]).split(".");
          var fileType = splitString.length >= 2 ? splitString[splitString.length - 1] : 'Other';

          if (validImageExtensions.includes(fileType.toLowerCase())) {
            return (
              <ThumbnailContainer
                key={index}
                onClick={() => editable ? onDeleteClick(index) : openMediaViewWithImage(f["@id"])}
              >
                <ImageThumbnail src={f["@id"]} />
              </ThumbnailContainer>
            );
          } else {
            return (
              <ThumbnailContainer
                key={index}
                onClick={() => editable ? onDeleteClick(index) : openMediaViewWithFile(f["@id"])}
              >
                <LinkMedia>.{fileType}</LinkMedia>
              </ThumbnailContainer>
            );
          }
        })}
      </ScrollPanelMedia>

      <DeleteModal>
        <DeleteConfirmation id='delete-modal'>
          <ConfirmationDialog
            onAccept={() => onDeleteResult(true)}
            onDecline={onDeleteResult}
            options={{ message: 'Do you really want to delete this file?' }}
            parentSelector='#delete-modal' />
        </DeleteConfirmation>
      </DeleteModal>
    </MediaSectionWrapper>
  );
};

export default Multimedia;