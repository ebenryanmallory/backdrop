import {
    Thumbnail,
  } from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { useState } from "react";
import { Lightbox } from "./Modals/Lightbox";
import { ImageDropzone } from "./ImageDropzone";

export function UserImagesCard({ images }) {

    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);

    const {
        data,
        refetch: refetchProductCount,
        isLoading: isLoadingImages,
        isRefetching: isRefetchingImages,
      } = useAppQuery({
        url: "/api/get-user-images",
        reactQueryOptions: {
          onSuccess: () => {
            setIsLoading(false);
          },
        },
      });

      const css = `
      .thumbnail {
        max-width: 8rem;
        max-height: 8rem;
        cursor: pointer;
      }
      `
    return (
        <>
          <style>{css}</style>
          <div onClick={() => { setLightboxOpen(true) }}>
            { images.map((image, index) => {
                return (
                  <>
                  <img
                    className="thumbnail"
                    src={image}
                    alt={image}
                    key={`image-${index}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  </>
                );
              })
            }
          </div>
          <ImageDropzone 
            setUserHasUploadedFile={setUserHasUploadedFile}
          />
          <Lightbox 
            lightboxOpen={lightboxOpen}
            setLightboxOpen={setLightboxOpen}
            images={images}
          />
        </>
    )
}