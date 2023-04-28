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

    return (
        <>
        <div onClick={() => { setLightboxOpen(true) }}>
          <Thumbnail
              source={images[0]}
              size="large"
              alt="first image"
          />
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