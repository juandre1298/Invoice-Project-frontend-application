// import icons
import { useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";

export const ImageDisplay = (props) => {
  const { showImage, setShowImage, invoceSelected, invoceImgSelected } = props;
  console.log("imageDisplay Props:", props);
  // states

  const [zoom, setZoom] = useState(false);

  return (
    <section className="imagePopUpfloatingSection">
      <div
        className="imagePopUpOutOfBoxSection"
        onClick={() => {
          setShowImage(!showImage);
        }}
      ></div>
      <div className="imageDisplayPopUpBox">
        {invoceSelected.id ? (
          <h1>Voucher # {invoceSelected.id}</h1>
        ) : (
          <h1>Image Preview</h1>
        )}
        <div className="imageDisplayPhotoSection">
          {invoceImgSelected ? (
            <div
              onClick={() => {
                setZoom(!zoom);
              }}
              className={
                zoom
                  ? "imageSelectedPreviewContainerZoomed"
                  : "imageSelectedPreviewContainer"
              }
            >
              <img
                src={invoceImgSelected}
                alt={`loading ${invoceImgSelected}...`}
                className={
                  zoom ? "imageSelectedPreviewZoomed" : "imageSelectedPreview"
                }
              />
            </div>
          ) : (
            <BsImage className="imageDisplayPhotoSectionIcon" />
          )}
        </div>
      </div>
    </section>
  );
};
