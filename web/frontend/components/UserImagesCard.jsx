import {
  Icon
} from "@shopify/polaris";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import { useAppQuery } from "../hooks";
import { useState, useEffect } from "react";
import { Lightbox } from "./Modals/Lightbox";
import { ImageDropzone } from "./ImageDropzone";

export function UserImagesCard({ images }) {

    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);
    const [imageIndex, setImageIndex] = useState(null);

    useEffect(() => {
      imageIndex !== null && setLightboxOpen(true);
    }, [imageIndex]);

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
        .absolute {
          position: absolute;
        }
        .hidden {
          display: none;
        }
      `
    return (
        <>
          <style>{css}</style>
          <div>
            { images.map((image, index) => {
                return (
                  <div 
                    key={`user-image-${index}`}
                    onMouseOver={(e) => {e.target.querySelectorAll('.hidden').forEach(hidden => hidden.classList.remove('hidden'))}}
                    onMouseLeave={(e) => {e.target.querySelectorAll('.absolute').forEach(absolute => absolute.classList.add('hidden'))}}
                  >
                    <div className="absolute hidden">
                      <Icon
                        source={DeleteMinor}
                        color="base"
                        
                      />
                    </div>
                    <img
                      className="thumbnail"
                      src={image}
                      alt={image}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      onClick={() => {setImageIndex(index)}}
                    />
                  </div>
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
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
          />
        </>
    )
}