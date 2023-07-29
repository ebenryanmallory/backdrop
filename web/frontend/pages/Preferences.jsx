import { 
  VerticalStack,
  Page,
  Text,
  Box,
  HorizontalGrid,
  Divider,
  useBreakpoints,
  FooterHelp,
  Link,
  hsbToHex,
  hexToRgb,
  rgbToHsb
} from "@shopify/polaris";

import React, { useState, useEffect, Suspense } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import { BackdropSVG } from "../assets/BackdropSVG";
import { PlanMinor } from '@shopify/polaris-icons';
import { ContextualSaveBar, Toast } from '@shopify/app-bridge-react';

const PlanModal = React.lazy(() => import('../modals/PlanModal'));
import { CompressionCardLoading } from "../cards--preferences/CompressionCardLoading";
const CompressionCard = React.lazy(() => import('../cards--preferences/CompressionCard'));
import { ColorCardLoading } from "../cards--preferences/ColorCardLoading";
const ColorCard = React.lazy(() => import('../cards--preferences/ColorCard'));
import { AccountCardLoading } from "../cards--preferences/AccountCardLoading";
const AccountCard = React.lazy(() => import('../cards--preferences/AccountCard'));

export default function Preferences() {

  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);

  const { smUp } = useBreakpoints();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [showSavebar, setShowSavebar] = useState(false);

  const [useCompression, setUseCompression] = useState(true);
  const [compressionAmount, setCompressionAmount] = useState(30);
  const [useTransparent, setUseTransparent] = useState(false);
  const [bypassRemoval, setBypassRemoval] = useState(false);
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

  useEffect(() => {
    if (data && data.compression !== undefined) {
      setCompressionAmount(100 - data.compression)
    };
    if (data && data.use_compression !== undefined) {
      setUseCompression(data.use_compression)
    };
    if (data && data.bg_color !== undefined) {
      setColor(rgbToHsb(hexToRgb(data.bg_color)))
    };
    if (data && data.use_transparency !== undefined) {
      setUseTransparent(data.use_transparency)
    };
    if (data && data.bypass_removal !== undefined) {
      setBypassRemoval(data.bypass_removal)
    };
  }, [data]);

  const saveAction = {
    disabled: false,
    loading: false,
    onAction: async() => {
      if (data.userNotFound) {
        const userResponse = await fetch("/api/create-user");
        if (!userResponse.ok) {
          throw new Error(userResponse.statusText);
        }
      }
      const imageResponse = await fetch('/api/update-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            compression: 100 - compressionAmount,
            use_compression: useCompression,
            bg_color: hsbToHex(color),
            use_transparency: useTransparent,
            bypass_removal: bypassRemoval
          })
      })
      if (!imageResponse.ok) {
          throw new Error(imageResponse.statusText);
      } else {
        setShowSavebar(false);
        refetchPreferences();
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
          { isLoading === true &&
            <CompressionCardLoading />
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
                Applies background style after foreground is removed from image. Can be solid color or transparent.
              </Text>
            </VerticalStack>
          </Box>
          { isLoading === false &&
            <ColorCard 
              setShowSavebar={setShowSavebar}
              useTransparent={useTransparent}
              setUseTransparent={setUseTransparent}
              bypassRemoval={bypassRemoval}
              setBypassRemoval={setBypassRemoval}
              color={color}
              setColor={setColor}
            />
          }
          { isLoading === true &&
            <ColorCardLoading />
          }
        </HorizontalGrid>
        { data && !data.userNotFound &&
          <>
            {smUp ? <Divider borderStyle="base" /> : null}
            <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
              <Box
                as="section"
                paddingInlineStart={{ xs: 4, sm: 0 }}
                paddingInlineEnd={{ xs: 4, sm: 0 }}
              >
                <VerticalStack gap="4">
                  <Text as="h3" variant="headingMd">
                    Account
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Complete control of your information with one click.
                  </Text>
                </VerticalStack>
              </Box>
              { isLoading === false &&
                <AccountCard 
                  toastProps={toastProps}
                  setToastProps={setToastProps}
                />
              }
              { isLoading === true &&
                <AccountCardLoading />
              }
            </HorizontalGrid>
          </>
        }
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
        <Suspense fallback={<div></div>}>
          <PlanModal 
            setPlanModalOpen={setPlanModalOpen}
          />
        </Suspense>
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
