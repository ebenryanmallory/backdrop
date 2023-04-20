import {
    EmptyState,
    AlphaCard,
    AlphaStack,
    Thumbnail,
    Text,
    Link,
    DropZone,
    List,
    Banner,
    Button
  } from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { useState } from "react";

export function UserImagesCard({ images }) {

    const [isLoading, setIsLoading] = useState(true);

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
            <Thumbnail
                source={images[0]}
                size="large"
                alt="first image"
            />
        </>
    )
}