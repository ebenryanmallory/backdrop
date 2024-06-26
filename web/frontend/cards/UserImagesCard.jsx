import {
  Icon,
  Card,
  Box,
  HorizontalStack,
  Tooltip
} from "@shopify/polaris";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState, useEffect } from "react";
import { Lightbox } from "../modals/Lightbox";
import { AddProductImage } from "../components/AddProductImage";
import { AddCollectionImage } from "../components/AddCollectionImage";
import { ImageDropzone } from "../components/ImageDropzone";
import { deleteImage } from "../shared/deleteImage";

export function UserImagesCard() {

    const fetch = useAuthenticatedFetch();

    const [isLoading, setIsLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);
    const [imageIndex, setImageIndex] = useState(null);

    const [productPickerOpen, setProductPickerOpen] = useState(false);
    const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

    const emptyToastProps = { content: null };
    const [toastProps, setToastProps] = useState(emptyToastProps);

    useEffect(() => {
      imageIndex !== null && setLightboxOpen(true);
    }, [imageIndex]);

    const {
        data,
        refetch: refetchProducts,
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

      const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
      );

      const testImage = async (e, i) => {
        e.target.style.display = 'none';
        const retunedFetch = await fetch(e.target.src);
        if (!retunedFetch.ok && retunedFetch.status === 404) {
          await deleteImage(data.images, i, fetch);
          refetchProducts();
        }
      }

      const css = `
        .thumbnail {
          max-width: 8rem;
          max-height: 8rem;
          cursor: pointer;
        }
        .thumbnail:hover {
          border: lightgray solid .5px;
        }
        .absolute {
          position: absolute;
        }
        .relative {
          position: relative;
        }
        .hidden {
          display: none;
        }
        .icon--container {
          right: 0px;
          background: #f6f6f7;
          padding: 0px 0.4rem;
          border-radius: 0.3rem;
          margin: 2px;
          cursor: pointer;
        }
        .w-max-content {
          width: max-content;
        }
        .image--container {
          width: 8rem;
          align-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image--container:hover .hidden {
          display: block;
        }
      `

    return (
      <Card>
        <style>{css}</style>
        {toastMarkup}
        <HorizontalStack>
          { data && data.images.map((image, index) => {
              return (
                <div key={`user-image-${index}`} className="image--container">
                  <div className="relative w-max-content">
                    <div className="absolute hidden cursor-pointer icon--container"
                      onClick={async () => {
                        await deleteImage(data.images, index, fetch);
                        setToastProps({ content: 'Image removed' });
                        refetchProducts();
                      }}>
                      <Tooltip dismissOnMouseOut content="Delete Image" preferredPosition="mostSpace">
                        <Icon
                          source={DeleteMinor}
                          color="base"
                        />
                      </Tooltip>
                    </div>
                    <img
                      className="thumbnail"
                      src={image}
                      alt={image}
                      onError={(e) => testImage(e, index)}
                      onClick={() => setImageIndex(index)}
                    />
                  </div>
                </div>
              );
            })
          }
        </HorizontalStack>
        <Box padding="4" />
        <ImageDropzone 
          setUserHasUploadedFile={setUserHasUploadedFile}
          refetchProducts={refetchProducts}
        />
        { data && data.images &&
          <Lightbox 
            lightboxOpen={lightboxOpen}
            setLightboxOpen={setLightboxOpen}
            images={data.images}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            setCollectionPickerOpen={setCollectionPickerOpen}
            setProductPickerOpen={setProductPickerOpen}
            refetchProducts={refetchProducts}
          />
        }
        { data && data.images && productPickerOpen &&
          <AddProductImage 
            images={data.images}
            imageIndex={imageIndex}
            productPickerOpen={productPickerOpen}
            setProductPickerOpen={setProductPickerOpen}
            setLightboxOpen={setLightboxOpen}
            setToastProps={setToastProps}
          />
        }
        { data && data.images && collectionPickerOpen &&
          <AddCollectionImage 
            images={data.images}
            imageIndex={imageIndex}
            collectionPickerOpen={collectionPickerOpen}
            setLightboxOpen={setLightboxOpen}
            setCollectionPickerOpen={setCollectionPickerOpen}
            setToastProps={setToastProps}
          />
        }
      </Card>
    )
}