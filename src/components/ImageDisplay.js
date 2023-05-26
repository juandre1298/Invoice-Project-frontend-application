// import icons
import { BsImage } from "react-icons/bs";

export const ImageDisplay = (props) => {
  const { showImage, setShowImage, invoceIdSelected, invoceImgSelected } =
    props;
  return (
    <section className="imagePopUpfloatingSection">
      <div
        className="imagePopUpOutOfBoxSection"
        onClick={() => {
          setShowImage(!showImage);
        }}
      ></div>
      <div className="imageDisplayPopUpBox">
        {invoceIdSelected ? (
          <h1>Voucher # {invoceIdSelected}</h1>
        ) : (
          <h1>Image Preview</h1>
        )}
        <div className="imageDisplayPhotoSection">
          {invoceImgSelected ? (
            <div className="imageSelectedPreviewContainer">
              <img className="imageSelectedPreview" src={invoceImgSelected} />
            </div>
          ) : (
            <BsImage className="imageDisplayPhotoSectionIcon" />
          )}
        </div>
      </div>
    </section>
  );
};
