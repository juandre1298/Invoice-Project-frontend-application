// import icons
import { useEffect, useState } from "react";
import { BsImage } from "react-icons/bs";

export const ImageDisplay = (props) => {
  const { showImage, setShowImage, invoceIdSelected, invoceImgSelected } =
    props;
  // states
  const [imageLink, setImageLink] = useState("");
  // set final link
  useEffect(() => {
    if (invoceImgSelected?.includes("google")) {
      const ini = invoceImgSelected.indexOf("/d/") + 3;
      const end = invoceImgSelected.indexOf("/view");
      const finalString = `https://drive.google.com/uc?export=view&id=${invoceImgSelected.slice(
        ini,
        end
      )}`;
      console.log(ini, end, finalString);
      setImageLink(finalString);
    } else {
      setImageLink(invoceImgSelected);
    }
  }, []);

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
              <img
                className="imageSelectedPreview"
                src={imageLink}
                alt={imageLink}
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
