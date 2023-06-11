import {
  EmptyState,
  Card
} from "@shopify/polaris";
import { noImage } from "../assets";
import { useState } from 'react';
import { ImageDropzone } from "../components/ImageDropzone";

export function EmptyStateCard({ getUserImages }) {

  const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);

  return (
    <>
      <Card>
        <EmptyState
          heading={userHasUploadedFile ? "Add additional images:" : "Upload an image for background removal"}
          secondaryAction={{
            content: 'Learn more',
            url: 'https://backdrop.motionstoryline.com/quickstart-guide/',
            external: true,
            target: "_blank"
          }}
          image={ userHasUploadedFile ? null : noImage}
        >
          <ImageDropzone
            setUserHasUploadedFile={setUserHasUploadedFile}
            getUserImages={getUserImages}
          />
          <p><strong>Welcome to Backdrop</strong> - your one click background removal Shopify app for creating product showcase images.</p>
        </EmptyState>
      </Card>
    </>
  );
}
