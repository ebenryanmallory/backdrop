import {
  Box,
  Page,
  HorizontalGrid,
  VerticalStack,
  Card,
  Badge,
  FooterHelp,
  Link
} from "@shopify/polaris";
import {
  SettingsMinor,
  PlanMinor
} from '@shopify/polaris-icons';
import { useNavigate } from '@shopify/app-bridge-react';

import { useAuthenticatedFetch } from "../hooks";

import { useState, useEffect } from 'react';

import { EmptyStateCard } from "../cards/EmptyStateCard";
import { PlanModal } from "../modals/PlanModal";
import { UserImagesCard } from "../cards/UserImagesCard";
import { PricingCard } from "../cards/PricingCard";
import { AboutCard } from "../cards/AboutCard";
import { ContactCard } from "../cards/ContactCard";
import { BackdropSVG } from "../assets/BackdropSVG";
import { SkeletonLabel } from "../components/SkeletonLabel";

export default function HomePage() {
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
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
          content: "Backdrop Preferences",
          icon: SettingsMinor,
          accessibilityLabel: "Secondary action label",
          onAction: () => { navigate('/preferences') }
        },
        {
          content: "Plan",
          icon: PlanMinor,
          accessibilityLabel: "Secondary action label",
          onAction: () => setPlanModalOpen(true),
        }
      ]}
    >
      <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
        <VerticalStack gap="4">
          { isLoading &&
            <Card roundedAbove="sm">
              <VerticalStack gap="4">
                <SkeletonLabel />
                <Box border="divider" borderRadius="base" minHeight="2rem" />
                <SkeletonLabel maxWidth="8rem" />
                <Box border="divider" borderRadius="base" minHeight="20rem" />
              </VerticalStack>
            </Card>
          }
          { !isLoading && images.length === 0 &&
            <EmptyStateCard 
              getUserImages={getUserImages}
            />
          }
          { !isLoading && images.length > 0 &&
              <UserImagesCard images={images} />
          }
          <AboutCard />
        </VerticalStack>
        <VerticalStack gap={{ xs: "4", md: "2" }}>
          <PricingCard 
            setPlanModalOpen={setPlanModalOpen}
          />
          <ContactCard />
        </VerticalStack>
      </HorizontalGrid>
      <FooterHelp>
      Learn more about{' '}
        <Link url="https://backdrop.motionstoryline.com/quickstart-guide/" 
          external={true}
          target="_blank"
        >
          using Backdrop
        </Link>
      </FooterHelp>
      { planModalOpen &&
        <PlanModal 
          setPlanModalOpen={setPlanModalOpen}
        />
      }
    </Page>
  );
}
