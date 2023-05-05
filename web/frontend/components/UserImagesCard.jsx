import {
  Icon,
  HorizontalStack
} from "@shopify/polaris";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import { useAppQuery } from "../hooks";
import { useState, useEffect } from "react";
import { Lightbox } from "./Modals/Lightbox";
import { AddProductImage } from "./AddProductImage";
import { AddCollectionImage } from "./AddCollectionImage";
import { ImageDropzone } from "./ImageDropzone";
import { deleteImage } from "../shared/deleteImage";
import { useAuthenticatedFetch } from "../hooks";

export function UserImagesCard({ images }) {

    const fetch = useAuthenticatedFetch();

    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);
    const [imageIndex, setImageIndex] = useState(null);

    const [productPickerOpen, setProductPickerOpen] = useState(false);
    const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

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
        .icon--container {
          right: 0px;
          background: #00000094;
          padding: 3px;
          cursor: pointer;
        }
        .image--container {
          position: relative;
        }
        .image--container:hover .hidden {
          display: block;
        }
        .icon--container svg {
          fill: var(--p-color-icon-on-color);
        }
      `

    return (
        <>
          <style>{css}</style>
          <HorizontalStack>
            { images.map((image, index) => {
                return (
                  <div 
                    key={`user-image-${index}`}
                    className="image--container"
                  >
                    <div className="absolute hidden cursor-pointer icon--container"
                      onClick={() => deleteImage(images, index, fetch)}>
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
          </HorizontalStack>
          <ImageDropzone 
            setUserHasUploadedFile={setUserHasUploadedFile}
          />
          <Lightbox 
            lightboxOpen={lightboxOpen}
            setLightboxOpen={setLightboxOpen}
            images={images}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            setCollectionPickerOpen={setCollectionPickerOpen}
            setProductPickerOpen={setProductPickerOpen}
            />
          { productPickerOpen &&
            <AddProductImage 
              images={images}
              imageIndex={imageIndex}
              productPickerOpen={productPickerOpen}
              setProductPickerOpen={setProductPickerOpen}
            />
          }
          { collectionPickerOpen &&
            <AddCollectionImage 
              images={images}
              imageIndex={imageIndex}
              collectionPickerOpen={collectionPickerOpen}
              setCollectionPickerOpen={setCollectionPickerOpen}
            />
          }
        </>
    )
}