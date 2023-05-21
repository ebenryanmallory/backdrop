import {
  EmptyState,
  AlphaCard
} from "@shopify/polaris";
import { noImage } from "../assets";
import { useState } from 'react';
import { Import } from "../components/Import"
import { ImageDropzone } from "../components/ImageDropzone";

export function EmptyStateCard() {

  const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);

  return (
    <>
      <AlphaCard>
        <EmptyState
          heading="Upload an image for background removal"
          secondaryAction={{
            content: 'Learn more',
            url: 'https://help.shopify.com',
          }}
          image={ userHasUploadedFile ? noImage : null}
        >
          <ImageDropzone
            setUserHasUploadedFile={setUserHasUploadedFile}
          />
          <p>One click background removal for creating product showcase images.</p>
        </EmptyState>
      </AlphaCard>
    </>
  );
}
