import {
  Thumbnail,
  Text,
  Link,
  DropZone,
  List,
  Banner,
  Button,
  ProgressBar,
  Box,
  HorizontalStack
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from "../hooks";
import { Import } from "./Import";

export function ImageDropzone({ setUserHasUploadedFile, refetchProducts }) {
  
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

  const removeFile = (e, index) => {
    e.stopPropagation();
    setFiles((files) => [...files].filter((_, i) => i !== index));
  }

  const fileUpload = !files.length > 0 && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{
      padding: 'var(--p-space-4)'
    }}>
      {files.map((file, index) => (
        <div key={index} style={{
          marginBottom: 'var(--p-space-4)'
        }}>
        <HorizontalStack gap='2' align="left">
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
            <Link variant="bodySm" monochrome removeUnderline={true} onClick={(e) => removeFile(e, index)}>
              Remove
            </Link>
          </div>
        </HorizontalStack>
        </div>
      ))}
    </div>
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
    for (let i = 0; i < files.length; i++) {

      setProgress(10);

      const formData = new FormData();
      const settings = {
        filename: files[i].name
      }
      formData.append('file', files[i]);
      formData.append('filename', settings.filename);

      // setUserHasUploadedFile is passed in only from empty state
      const preferencesResponse = await fetch("/api/get-preferences");
      const preferences = await preferencesResponse.json();
      const { userNotFound, compression, use_compression, bg_color, use_transparency, bypass_removal, free_count, plan_type } = preferences;
      formData.set('compression', compression);
      settings['compression'] = compression;
      formData.set('use_compression', use_compression);
      settings['use_compression'] = use_compression;
      formData.set('bg_color', bg_color);
      settings['bg_color'] = bg_color;
      formData.set('use_transparency', use_transparency);
      settings['use_transparency'] = use_transparency;
      formData.set('bypass_removal', bypass_removal);
      settings['bypass_removal'] = bypass_removal;
      formData.set('plan_type', plan_type);
      settings['plan_type'] = plan_type;
      
      if (userNotFound) {
        const userResponse = await fetch("/api/create-user");
        if (userResponse.ok) {
          setProgress(20);
        } else {
          setProgress(100);
          setToastProps({
            content: "There was an error creating a new user",
            error: true
          });
          return
        }
      }
      if (free_count > 0) {
        const userFreeResponse = await fetch('/api/update-free-count', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updated_count: free_count - 1 })
        })
        if (!userFreeResponse.ok) {
          setProgress(100);
          setToastProps({
            content: "Please check your connection and try again.",
            error: true
          });
          return
        }
      } else {
        setProgress(100);
        setToastProps({
          content: "You have no free images left. Please upgrade",
          error: true
        });
        return
      }
      if (bypass_removal === false) {
        const imageResponse = await fetch('/api/remove-bg', {
          method: 'POST',
          body: formData
        })
        const imageResponseJSON = await imageResponse.json();
        if (imageResponse.ok && imageResponseJSON?.status !== 403) {
          setProgress(60);
        } else {
          console.log('403 detected')
          setProgress(100);
          setToastProps({
            content: "There was an error removing the background from your image",
            error: true
          });
          return
        }
      }
      if (settings['use_compression'] === true) {
        const compressedResponse = await fetch("/api/compress", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        })
        if (compressedResponse.ok) {
          setProgress(80);
        } else {
          setProgress(100);
          setToastProps({
            content: "There was an error compressing your image",
            error: true
          });
        }
      }
      const uploadResponse = await fetch("/api/upload", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const jsonContent = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setProgress(100);
        setToastProps({
          content: "There was an error uploading your image",
          error: true
        });
        return
      }
      setProgress(100);
      setToastProps(jsonContent);
      refetchProducts();
    }
  }

  return (
    <>
      {toastMarkup}
      {errorMessage}
      { progress > 0 && progress < 100 &&
        <ProgressBar progress={progress} size="small" color='primary' />
      }
      <DropZone accept="image/jpg, image/jpeg, image/png" type="image" onDrop={handleDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
      { files.length > 0 &&
        <Box paddingBlockStart="4" paddingBlockEnd="4">
          <Button primary fullWidth={false} size="medium" style={{ marginTop: '1rem' }}
            onClick={() => applyRemoval()}>
              Apply removal
          </Button>
        </Box>
      }
      <Box padding="4">
        <Import
          files={files}
          setFiles={setFiles}
          setToastProps={setToastProps}
        />
      </Box>
    </>
  );
}
