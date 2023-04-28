import { 
  VerticalStack,
  Page,
  Text,
  Box,
  AlphaCard,
  Checkbox,
  HorizontalGrid,
  Divider,
  useBreakpoints,
  ColorPicker,
  RangeSlider,
  Collapsible,
  Button
} from "@shopify/polaris";
import { BalanceMajor } from '@shopify/polaris-icons';
import { useContextualSaveBar } from '@shopify/app-bridge-react';
import { useState, useCallback } from 'react';
import { PlanModal } from "../components/Modals/PlanModal";
import { BackdropSVG } from "../assets/BackdropSVG";

export default function Settings() {
  const { smUp } = useBreakpoints();
  const [useCompression, setUseCompression] = useState(true);
  const [useTransparent, setUseTransparent] = useState(true);
  const [rangeValue, setRangeValue] = useState(20);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const {show, hide, saveAction, discardAction} = useContextualSaveBar();
  const [colorOpen, setColorOpen] = useState(false);

  const toggleColor = useCallback(() => setColorOpen((colorOpen) => !colorOpen), []);

  const [color, setColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0,
    alpha: 1,
  });

  const toggleUseCompression = useCallback(
    (updatedToggle) => setUseCompression(updatedToggle),
    [],
  );

  const toggleUseTransparent = useCallback(
    (updatedToggle) => setUseTransparent(updatedToggle),
    [],
  );

  const setCompressionValue = useCallback(
    (updatedValue) => {
      setRangeValue(updatedValue)
    },
    [],
  );

  return (
    <Page
      divider
      title={<BackdropSVG />}
      titleMetadata={<Text>Settings</Text>}
      secondaryActions={[
        {
          content: "Plan",
          icon: BalanceMajor,
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
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
              <Checkbox
                label="Use compression"
                checked={useCompression}
                onChange={toggleUseCompression}
              />
              <RangeSlider
                output
                label="Compression"
                min={0}
                max={100}
                value={rangeValue}
                onChange={setCompressionValue}
                prefix={<p>Amount</p>}
                suffix={
                  <p
                    style={{
                      minWidth: '24px',
                      textAlign: 'right',
                    }}
                  >
                    {rangeValue}
                  </p>
                }
              />
            </VerticalStack>
          </AlphaCard>
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
                Default background color
              </Text>
              <Text as="p" variant="bodyMd">
                Apply a color background after foreground is removed (default white).
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <VerticalStack gap="4">
            <Checkbox
                label="Transparent"
                checked={useTransparent}
                onChange={toggleUseTransparent}
              />
              <Button
                onClick={toggleColor}
                ariaExpanded={colorOpen}
                ariaControls="basic-collapsible"
              >
                Solid color
              </Button>
              <Collapsible
                open={colorOpen}
                id="basic-collapsible"
                transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                expandOnPrint
              >
              <ColorPicker onChange={setColor} color={color} allowAlpha />
              </Collapsible>
            </VerticalStack>
          </AlphaCard>
        </HorizontalGrid>
      </VerticalStack>
      { planModalOpen &&
        <PlanModal />
      }
    </Page>
  );
}
