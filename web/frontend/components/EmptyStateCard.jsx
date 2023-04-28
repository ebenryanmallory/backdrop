import {
  EmptyState,
  AlphaCard,
  Link,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { noImage } from "../assets";
import { useState } from 'react';
import { ImageDropzone } from "./ImageDropzone";

export function EmptyStateCard() {

  const [userHasUploadedFile, setUserHasUploadedFile] = useState(false);
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);

  return (
    <>
      <AlphaCard>
        <EmptyState
          heading="Upload an image for background removal"
          secondaryAction={{
            content: 'Learn more',
            url: 'https://help.shopify.com',
          }}
          footerContent={
            <>
              <p>
                Or, you can also remove backgrounds from your {' '}
                <Link monochrome url="/settings" onClick={() => setResourcePickerOpen(true)}>
                  existing images
                </Link>
                .
              </p>
              { resourcePickerOpen &&
              <>
                <ResourcePicker resourceType="Product" open />
                <ResourcePicker resourceType="Collection" open />
              </>
              }
            </>
          }
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
