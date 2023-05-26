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
        <h1>Voucher # {invoceIdSelected}</h1>
        <div className="imageDisplayPhotoSection">
          <BsImage className="imageDisplayPhotoSectionIcon" />
        </div>
      </div>
    </section>
  );
};
