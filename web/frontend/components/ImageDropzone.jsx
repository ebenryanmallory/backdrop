import {
  VerticalStack,
  Thumbnail,
  Text,
  DropZone,
  List,
  Banner,
  Button,
  ProgressBar
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from "../hooks";

export function ImageDropzone({ setUserHasUploadedFile }) {
  
  const emptyToastProps = { content: null };
  const fetch = useAuthenticatedFetch();

  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const hasError = rejectedFiles.length > 0;

  useEffect(() => {
    if (files.length > 0) {
      setUserHasUploadedFile(true);
    }
  }, [files]);

  const handleDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

  const fileUpload = !files.length > 0 && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <VerticalStack align="left" style={{
      padding: 'var(--p-space-4)'
    }}>
      {files.map((file, index) => (
        <VerticalStack align="left" key={index}>
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
        </VerticalStack>
      ))}
    </VerticalStack>
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
    setProgress(10);
    let userExists = true;
    if (!userExists) {
      const userResponse = await fetch("/api/create-user");
      const result = await userResponse.text();
      console.log(result)
      if (userResponse.ok) {
        setProgress(20);
        userExists = true 
      } else {
        setProgress(100);
        setToastProps({
          content: "There was an error removing background",
          error: true,
        });
      }
    }
    // const imageResponse = await fetch("/api/remove-bg");
    setProgress(60);
    const compressedResponse = await fetch("/api/compress");
    setProgress(80);
    const uploadResponse = await fetch("/api/upload");
    const cdn_url = await uploadResponse.text();
    if (uploadResponse.ok) {
      setProgress(100);
      setToastProps({ content: "Success!" });
    }
  }

  return (
    <>
      {toastMarkup}
      {errorMessage}
      { progress > 0 && progress < 100 &&
        <ProgressBar progress={progress} size="small" color='primary' />
      }
      <DropZone accept="image/*" type="image" onDrop={handleDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
      { files.length > 0 &&
        <Button primary fullWidth={false} size="medium" onClick={() => applyRemoval()}>Apply removal</Button>
      }
    </>
  );
}
