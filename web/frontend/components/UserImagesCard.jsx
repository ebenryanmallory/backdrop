import {
  Icon
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
import { useAuthenticatedFetch } from "../hooks";

export function UserImagesCard({ images }) {

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

      const fetch = useAuthenticatedFetch();
      const deleteImage = async () => {
        try {
          const deleteImageResponse = await fetch('/api/delete-user-image', {
            method: 'POST',
            body: { url: images[imageIndex] }
          });
    
          if (!deleteImageResponse.ok) {
            throw new Error(deleteImageResponse.statusText);
          }
    
          const { jsonResponse } = await deleteImageResponse.json();
          console.log(jsonResponse?.message)
    
        } catch (error) {
          console.error(error);
        }
      }

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
        .image--container:hover .hidden {
          display: block;
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
                    className="image--container"
                  >
                    <div className="absolute hidden cursor-pointer">
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