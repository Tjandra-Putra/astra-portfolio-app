// ImageGallery.tsx
import React from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
// import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Inline from "yet-another-react-lightbox/plugins/inline";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type ImageGalleryProps = {
  /** Accept either URL strings or fully‑typed Slide objects */
  images: (string | Slide)[];
  /** Index to open at (defaults 0) */
  startIndex?: number;
  /** Anything you want to render as the “trigger” */
  children?: React.ReactNode;
  isInline?: boolean;
};

const inline = {
  style: {
    width: "100%",
    maxWidth: "900px",
    aspectRatio: "2/2",
    margin: "0 auto",
  },
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, startIndex = 0, children, isInline = false }) => {
  const [open, setOpen] = React.useState(false);

  const slides = React.useMemo<Slide[]>(() => images.map((img) => (typeof img === "string" ? { src: img } : img)), [images]);

  const wrapWithClick = (nodes: React.ReactNode) => {
    if (isInline) {
      // Inline mode: just render children as is, no wrapping or onClick
      return nodes;
    }

    const handleOpen = () => setOpen(true);

    if (React.isValidElement(nodes)) {
      return React.cloneElement(nodes, {
        onClick: handleOpen,
        ...(nodes.props || {}),
        style: { cursor: "pointer", ...nodes.props?.style },
      });
    }

    return (
      <div onClick={handleOpen} style={{ cursor: "pointer" }}>
        {nodes}
      </div>
    );
  };

  return (
    <>
      {wrapWithClick(children)}

      <Lightbox
        // toolbar={{
        //   buttons: [
        //     <button key="my-button" type="button" className="yarl__button">
        //       Button
        //     </button>,
        //     "close",
        //   ],
        // }}
        open={isInline || open} // always open if inline
        close={() => setOpen(false)}
        index={startIndex}
        slides={slides}
        plugins={[Counter, Fullscreen, ...(slides.length > 1 ? [Thumbnails] : []), Zoom, ...(isInline ? [Inline] : [])]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        inline={isInline ? inline : undefined}
        carousel={{
          spacing: 0,
          padding: 0,
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
};

export default ImageGallery;
