// ImageGallery.tsx
import React from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type ImageGalleryProps = {
  /** Accept either simple URL strings or fully‑typed Slide objects */
  images: (string | Slide)[];
  /** Optional: initial slide index (default 0) */
  startIndex?: number;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, startIndex = 0 }) => {
  const [open, setOpen] = React.useState(false);

  /** Convert string URLs ➜ { src: string } slides */
  const slides: Slide[] = React.useMemo(() => images.map((item) => (typeof item === "string" ? { src: item } : item)), [images]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        /** You can start from any index */
        index={startIndex}
        slides={slides}
        plugins={[Counter, Download, Fullscreen, Thumbnails, Zoom]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
      />
    </>
  );
};

export default ImageGallery;
