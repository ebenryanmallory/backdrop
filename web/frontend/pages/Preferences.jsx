import { 
  VerticalStack,
  Page,
  Text,
  Box,
  HorizontalGrid,
  Divider,
  useBreakpoints,
  FooterHelp,
  Link
} from "@shopify/polaris";
import { PlanMinor } from '@shopify/polaris-icons';
import { ContextualSaveBar } from '@shopify/app-bridge-react';
import { useState } from 'react';
import { PlanModal } from "../modals/PlanModal";
import { CompressionCard } from "../cards--preferences/CompressionCard";
import { ColorCard } from "../cards--preferences/ColorCard";
import { BackdropSVG } from "../assets/BackdropSVG";

export default function Preferences() {
  const { smUp } = useBreakpoints();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [showSavebar, setShowSavebar] = useState(false);

  const fetch = useAuthenticatedFetch();

  const saveAction = {
    disabled: false,
    loading: false,
    onAction: async() => {
      const imageResponse = await fetch('/api/update-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            compression: 20,
            use_compression: true,
            bg_color: '#FFFFFF',
            use_bg_color: true
          })
      })
      if (!imageResponse.ok) {
          throw new Error(imageResponse.statusText);
      }
    }
  }

  const discardAction = {
    disabled: false,
    loading: false,
    discardConfirmationModal: true,
    onAction: () => {
      setShowSavebar(false)
    }
  }

  return (
    <Page
      divider
      title={<BackdropSVG />}
      titleMetadata={<Text>Preferences</Text>}
      secondaryActions={[
        {
          content: "Plan",
          icon: PlanMinor,
          accessibilityLabel: "Secondary action label",
          onAction: () => setPlanModalOpen(true),
        }
      ]}
    >
      <VerticalStack gap={{ xs: "8", sm: "4" }}>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Compression
              </Text>
              <Text as="p" variant="bodyMd">
                Amount of compression applied to each image. A lower number will reduce the file size by applying more compression.
              </Text>
            </VerticalStack>
          </Box>
          <CompressionCard 
            setShowSavebar={setShowSavebar}
          />
        </HorizontalGrid>
        {smUp ? <Divider borderStyle="base" /> : null}
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Background
              </Text>
              <Text as="p" variant="bodyMd">
                Applies background style after foreground is removed. Can be solid color or transparent.
              </Text>
            </VerticalStack>
          </Box>
          <ColorCard 
            setShowSavebar={setShowSavebar}
          />
        </HorizontalGrid>
      </VerticalStack>
      <FooterHelp>
      Learn more about{' '}
        <Link url="https://backdrop.motionstoryline.com/preferences/"
          external={true}
          target="_blank"
        >
          Backdrop preferences
        </Link>
      </FooterHelp>
      { planModalOpen &&
        <PlanModal 
          setPlanModalOpen={setPlanModalOpen}
        />
      }
      { showSavebar &&
        <ContextualSaveBar
          saveAction={saveAction}
          discardAction={discardAction}
          fullWidth
          leaveConfirmationDisable
          visible
        />
      }
    </Page>
  );
}
