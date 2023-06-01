import {
  Card,
  Box,
  Divider,
  SkeletonDisplayText,
  SkeletonBodyText
} from "@shopify/polaris";

export function ColorCardLoading() {

  return (
    <Card roundedAbove="sm">
      <SkeletonDisplayText />
      <Box padding="3" />
      <Divider />
      <Box padding="3" />
      <SkeletonBodyText />
    </Card>
  );
}
