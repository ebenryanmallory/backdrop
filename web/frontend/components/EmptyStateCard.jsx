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
import { Toast, ResourcePicker } from "@shopify/app-bridge-react";
import { noImage } from "../assets";
import { useState, useCallback } from 'react';
import { useAuthenticatedFetch } from "../hooks";

export function EmptyStateCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  const hasError = rejectedFiles.length > 0;
  const fetch = useAuthenticatedFetch();

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

  const fileUpload = !files.length > 0 && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <AlphaStack align="left" style={{
      padding: 'var(--p-space-4)'
    }}>
      {files.map((file, index) => (
        <AlphaStack align="left" key={index}>
          <Thumbnail
            size="large"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </AlphaStack>
      ))}
    </AlphaStack>
  );

  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .jpg, .png, or .gif.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const applyRemoval = async () => {
    setIsLoading(true);
    let userExists = true;
    if (!userExists) {
      const userResponse = await fetch("/api/create-user");
      const result = await userResponse.text();
      console.log(result)
      if (userResponse.ok) { 
        userExists = true 
      } else {
        setIsLoading(false);
        setToastProps({
          content: "There was an error removing background",
          error: true,
        });
      }
    }
    // const imageResponse = await fetch("/api/remove-bg");
    const compressedResponse = await fetch("/api/compress");
    const uploadResponse = await fetch("/api/upload");
    const cdn_url = await uploadResponse.text();
    if (uploadResponse.ok) { 
      setToastProps({ content: "Success!" });
    }
  }

  return (
    <>
      {toastMarkup}
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
          image={ files.length === 0 ? noImage : null}
        >
          {errorMessage}
          <DropZone accept="image/*" type="image" onDrop={handleDrop}>
            {uploadedFiles}
            {fileUpload}
          </DropZone>
          { files.length > 0 &&
            <Button primary fullWidth={false} size="medium" onClick={() => applyRemoval()}>Apply removal</Button>
          }
          <p>One click background removal for creating product showcase images.</p>
        </EmptyState>
      </AlphaCard>
    </>
  );
}
