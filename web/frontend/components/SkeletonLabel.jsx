import {
    Box,
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
  
export const SkeletonLabel = (props) => {
    return (
      <Box
        background="surface-neutral"
        minHeight="1rem"
        maxWidth="5rem"
        borderRadius="base"
        {...props}
      />
    );
  };