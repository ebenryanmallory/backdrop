import {
  Card,
  Box,
  Divider,
  SkeletonBodyText,
  SkeletonDisplayText
} from "@shopify/polaris";

export function CompressionCardLoading() {

  return (
    <Card roundedAbove="sm">
      <Box padding={'1'}>
        <SkeletonDisplayText />
      </Box>
      <Box padding="4" />
      <SkeletonBodyText />
      <Box padding="1" />
      <Divider />
      <Box padding="1" />
    </Card>
  );
}
