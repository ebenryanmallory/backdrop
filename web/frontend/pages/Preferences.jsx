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
import { ContextualSaveBar, Toast } from '@shopify/app-bridge-react';
import { useState } from 'react';
import { PlanModal } from "../modals/PlanModal";
import { CompressionCard } from "../cards--preferences/CompressionCard";
import { ColorCard } from "../cards--preferences/ColorCard";
import { BackdropSVG } from "../assets/BackdropSVG";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function Preferences() {

  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);

  const { smUp } = useBreakpoints();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [showSavebar, setShowSavebar] = useState(false);

  const [useCompression, setUseCompression] = useState(true);
  const [compressionAmount, setCompressionAmount] = useState(80);
  const [useTransparent, setUseTransparent] = useState(false);
  const [color, setColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0
  });

  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(true);

  const {
    data,
    refetch: refetchPreferences,
    isLoading: isLoadingPreferences,
    isRefetching: isRefetchingPreferences,
  } = useAppQuery({
    url: "/api/get-preferences",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const saveAction = {
    disabled: false,
    loading: false,
    onAction: async() => {
      const imageResponse = await fetch('/api/update-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            compression: compressionAmount,
            use_compression: useCompression,
            bg_color: color,
            use_transparency: useTransparent
          })
      })
      if (!imageResponse.ok) {
          throw new Error(imageResponse.statusText);
      } else {
        setShowSavebar(false)
        setToastProps({ content: "Preferences have been updated!" });
      }
    }
  }

  const discardAction = {
    disabled: false,
    loading: false,
    discardConfirmationModal: true,
    onAction: () => {
      setUseCompression(data.use_compression)
      setCompressionAmount(100 - data.compression)
      setShowSavebar(false)
    }
  }

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

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
      {toastMarkup}
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
                Amount of compression applied to each image.
                More compression will reduce the file size, but too much can degrade image quality.
              </Text>
            </VerticalStack>
          </Box>
          { isLoading === false &&
            <CompressionCard 
              setShowSavebar={setShowSavebar}
              useCompression={useCompression}
              setUseCompression={setUseCompression}
              compressionAmount={compressionAmount}
              setCompressionAmount={setCompressionAmount}
              data={data}
            />
          }
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
          { isLoading === false &&
            <ColorCard 
              setShowSavebar={setShowSavebar}
              useTransparent={useTransparent}
              setUseTransparent={setUseTransparent}
              color={color}
              setColor={setColor}
            />
          }
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
