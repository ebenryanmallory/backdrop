import {
  EmptyState,
  Card
} from "@shopify/polaris";
import { noImage } from "../assets";
import { useState } from 'react';
import { Import } from "../components/Import"
import { ImageDropzone } from "../components/ImageDropzone";

export function EmptyStateCard() {

  const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);

  return (
    <>
      <Card>
        <EmptyState
          heading={userHasUploadedFile ? "Add additional images:" : "Upload an image for background removal"}
          secondaryAction={{
            content: 'Learn more',
            url: 'https://backdrop.motionstoryline.com/',
            external: true,
            target: "_blank"
          }}
          image={ userHasUploadedFile ? null : noImage}
        >
          <ImageDropzone
            setUserHasUploadedFile={setUserHasUploadedFile}
          />
          <p>One click background removal for creating product showcase images.</p>
        </EmptyState>
      </Card>
    </>
  );
}
