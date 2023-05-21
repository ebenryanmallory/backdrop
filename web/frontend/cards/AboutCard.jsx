import { useState } from "react";
import {
  AlphaCard,
  VerticalStack,
  HorizontalGrid,
  Box,
  Bleed,
  Divider,
  Text
} from "@shopify/polaris";

export function AboutCard() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlphaCard roundedAbove="sm">
      <VerticalStack gap="4">
        <Text size="small">About</Text>
        <Box>
          <Bleed marginInline={{ xs: 4, sm: 5 }}>
            <Divider borderStyle="divider" />
          </Bleed>
        </Box>
        <HorizontalGrid columns={{ xs: 1, md: 2 }}>
          <Box border="divider" borderRadius="base" minHeight="10rem">
            <Text size="small">Quickstart Guide</Text>
            <Text size="small">See image demo</Text>
          </Box>
          <Box border="divider" borderRadius="base" minHeight="10rem">
            <Text size="small">Documentation + Videos</Text>
            <Text size="small">Limitations and recommendations</Text>
            <Text size="small">Bulk processing</Text>
          </Box>
        </HorizontalGrid>
      </VerticalStack>
    </AlphaCard>
  );
}
