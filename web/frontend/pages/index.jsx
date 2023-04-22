import {
  Box,
  Page,
  Columns,
  AlphaStack,
  AlphaCard,
  Text,
  SkeletonDisplayText,
  SkeletonBodyText,
  Badge
} from "@shopify/polaris";
import {
  SettingsMinor,
  BalanceMajor
} from '@shopify/polaris-icons';
import { useAuthenticatedFetch } from "../hooks";

import { useState, useEffect } from 'react';

import { EmptyStateCard } from "../components/EmptyStateCard";
import { UserImagesCard } from "../components/UserImagesCard";
import { PricingCard } from "../components/PricingCard";
import { BackdropSVG } from "../components/BackdropSVG";
import { SkeletonLabel } from "../components/SkeletonLabel";

export default function HomePage() {
  
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    getUserImages();
  }, []);

  async function getUserImages() {
    setIsLoading(true);

    try {
      const imageResponse = await fetch('/api/get-user-images');

      if (!imageResponse.ok) {
        throw new Error(imageResponse.statusText);
      }

      const { images } = await imageResponse.json();
      setImages(images);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Page
      title={<BackdropSVG />}
      titleMetadata={<Badge status="attention">Verified</Badge>}
      secondaryActions={[
        {
          content: "Backdrop Settings",
          icon: SettingsMinor,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Go to settings"),
        },
        {
          content: "Plan",
          icon: BalanceMajor,
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Account modal"),
        }
      ]}
    >
      <Columns columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
        <AlphaStack gap="4">
          { isLoading &&
            <AlphaCard roundedAbove="sm">
              <AlphaStack gap="4">
                <SkeletonLabel />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="8rem" />
                <Box border="divider" borderRadius="base" minHeight="20rem" />
              </AlphaStack>
            </AlphaCard>
          }
          { !isLoading && images.length === 0 &&
            <EmptyStateCard />
          }
          { !isLoading && images.length > 0 &&
              <UserImagesCard images={images} />
          }
          <AlphaCard roundedAbove="sm">
            <AlphaStack gap="4">
              { isLoading &&
                <SkeletonDisplayText size="small" />
              }
              { !isLoading &&
                <Text size="small">About</Text>
              }
              <Columns columns={{ xs: 1, md: 2 }}>
                <Box border="divider" borderRadius="base" minHeight="10rem">
                  <Text size="small">Quickstart Guide</Text>
                  <Text size="small">See image demo</Text>
                </Box>
                <Box border="divider" borderRadius="base" minHeight="10rem">
                  <Text size="small">Documentation + Videos</Text>
                  <Text size="small">Limitations and recommendations</Text>
                  <Text size="small">Bulk processing</Text>
                </Box>
              </Columns>
            </AlphaStack>
          </AlphaCard>
        </AlphaStack>
        <AlphaStack gap={{ xs: "4", md: "2" }}>
          <PricingCard />
          <AlphaCard roundedAbove="sm">
            <AlphaStack gap="4">
              <SkeletonLabel />
              <Text>Contact Support</Text>
              <Box border="divider" borderRadius="base" minHeight="2rem" />
              <SkeletonLabel maxWidth="4rem" />
              <Box border="divider" borderRadius="base" minHeight="2rem" />
              <SkeletonLabel />
              <SkeletonBodyText />
            </AlphaStack>
          </AlphaCard>
        </AlphaStack>
      </Columns>
    </Page>
  );
}
