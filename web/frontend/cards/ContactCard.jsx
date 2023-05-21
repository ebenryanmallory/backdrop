import { useState } from "react";
import {
  AlphaCard,
  VerticalStack,
  Box,
  Bleed,
  Divider,
  Text,
  Link
} from "@shopify/polaris";
import { SkeletonLabel } from "../components/SkeletonLabel";

export function ContactCard() {

  return (
    <AlphaCard roundedAbove="sm">
      <VerticalStack gap="4">
        <Text>Contact Support</Text>
        <Box>
          <Bleed marginInline={{ xs: 4, sm: 5 }}>
            <Divider borderStyle="divider" />
          </Bleed>
        </Box>
        <Link monochrome
          url="https://backdrop.motionstoryline.com/" 
          external={true}
          target="_blank"
        >Contact Form</Link>
      </VerticalStack>
    </AlphaCard>
  );
}
