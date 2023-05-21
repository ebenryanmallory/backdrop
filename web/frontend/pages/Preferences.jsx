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
import { useContextualSaveBar } from '@shopify/app-bridge-react';
import { useState } from 'react';
import { PlanModal } from "../modals/PlanModal";
import { CompressionCard } from "../cards--preferences/CompressionCard";
import { ColorCard } from "../cards--preferences/ColorCard";
import { BackdropSVG } from "../assets/BackdropSVG";

export default function Preferences() {
  const { smUp } = useBreakpoints();
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const {show, hide, saveAction, discardAction} = useContextualSaveBar();

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
                How much compression is set to images for web export
              </Text>
            </VerticalStack>
          </Box>
          <CompressionCard />
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
                Background color
              </Text>
              <Text as="p" variant="bodyMd">
                Apply a color background after foreground is removed (default white).
              </Text>
            </VerticalStack>
          </Box>
          <ColorCard />
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
    </Page>
  );
}
