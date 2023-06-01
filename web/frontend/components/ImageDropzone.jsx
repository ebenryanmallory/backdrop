import {
  Thumbnail,
  Text,
  DropZone,
  List,
  Banner,
  Button,
  ProgressBar,
  Box,
  HorizontalGrid
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import { useAuthenticatedFetch } from "../hooks";
import { Import } from "./Import";

export function ImageDropzone({ setUserHasUploadedFile, getUserImages }) {
  
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
    <HorizontalGrid align="left" style={{
      padding: '1rem' // 'var(--p-space-4)'
    }}>
      {files.map((file, index) => (
        <HorizontalGrid align="left" key={index}>
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
        </HorizontalGrid>
      ))}
    </HorizontalGrid>
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

    const formData = new FormData();
    const settings = {
      compression: 20,
      use_compression: true,
      bg_color: '#FFFFFFF',
      use_transparency: false,
      filename: files[0].name
    }
    formData.append('compression', settings.compression);
    formData.append('use_compression', settings.use_compression);
    formData.append('bg_color', settings.bg_color);
    formData.append('use_transparency', settings.use_transparency);
    formData.append('file', files[0]);
    formData.append('filename', settings.filename);

    // setUserHasUploadedFile is passed in only from empty state
    let userExists = setUserHasUploadedFile ? false : true;
    if (!userExists) {
      const userResponse = await fetch("/api/create-user");
      const result = await userResponse.text();
      if (userResponse.ok) {
        setProgress(20);
        userExists = true;
      } else {
        setProgress(100);
        setToastProps({
          content: "There was an error creating a new user",
          error: true
        });
      }
    } else {
      const preferencesResponse = await fetch("/api/get-preferences");
      const preferences = await preferencesResponse.json();
      const { compression, use_compression, bg_color, use_transparency } = preferences;
      if (compression === undefined) { return }
      formData.set('compression', compression);
      settings['compression'] = compression;
      formData.set('use_compression', use_compression);
      settings['use_compression'] = use_compression;
      formData.set('bg_color', bg_color);
      settings['bg_color'] = bg_color;
      formData.set('use_transparency', use_transparency);
      settings['use_transparency'] = use_transparency;
    }
    const imageResponse = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData
    })
    const returnedName = imageResponse.json;
    setProgress(60);
    if (settings['use_compression'] === true) {
      const compressedResponse = await fetch("/api/compress", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      const returnedCompressionResult = compressedResponse.json;
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
    const cdn_url = await uploadResponse.text();
    if (uploadResponse.ok) {
      setProgress(100);
      setToastProps({ content: "Success!" });
      getUserImages();
    } else {
      setProgress(100);
      setToastProps({
        content: "There was an error uploading your image",
        error: true
      });
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
        <Box padding="4">
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
