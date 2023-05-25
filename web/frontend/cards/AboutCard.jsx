import { useState } from "react";
import {
  AlphaCard,
  VerticalStack,
  HorizontalGrid,
  Box,
  Bleed,
  Divider,
  Text,
  Link
} from "@shopify/polaris";

export function AboutCard() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlphaCard roundedAbove="sm">
      <VerticalStack gap="4">
        <Text size="small" fontWeight="semibold">About</Text>
        <Box>
          <Bleed marginInline={{ xs: 4, sm: 5 }}>
            <Divider borderStyle="divider" />
          </Bleed>
        </Box>
        <HorizontalGrid columns={{ xs: 1, md: 2 }}>
          <Box border="divider" borderRadius="base" minHeight="10rem">
            <Link monochrome url="https://backdrop.motionstoryline.com/quickstart-guide/" 
              external removeUnderline={true} target="_blank">
              Quickstart Guide
            </Link>
            <Box minHeight="1rem" />
            <Link monochrome url="https://backdrop.motionstoryline.com/image-demo/" 
              external removeUnderline={true} target="_blank">
              See image demo
            </Link>
          </Box>
          <Box border="divider" borderRadius="base" minHeight="10rem">
            <Link monochrome url="https://backdrop.motionstoryline.com/"
              external removeUnderline={true} target="_blank">
              Documentation + Videos
            </Link>
            <Box minHeight="1rem" />
            <Link monochrome url="https://backdrop.motionstoryline.com/limitations-and-recommendations/"
              external removeUnderline={true} target="_blank">
              Limitations and recommendations
            </Link>
            <Box minHeight="1rem" />
            <Link monochrome url="https://backdrop.motionstoryline.com/bulk-processing/"
              external removeUnderline={true} target="_blank">
              Bulk processing
            </Link>
          </Box>
        </HorizontalGrid>
      </VerticalStack>
    </AlphaCard>
  );
}
