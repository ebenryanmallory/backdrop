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
  Popover,
  HorizontalStack,
  FooterHelp,
  Link
} from "@shopify/polaris";
import { PlanMajor } from '@shopify/polaris-icons';
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

  const colorCircle = (
    <div 
      onClick={toggleColor}
      className="color--disabled color-circle"
    >
    </div>
  );

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

  const css = `
    .color--disabled {
      background: linear-gradient(to bottom right,var(--p-color-bg) calc(50% - 0.125rem),var(--p-color-border-subdued) calc(50% - 0.125rem) calc(50% + 0.125rem),var(--p-color-bg) calc(50% + 0.125rem));
    }
    .color-circle {
      width: 40px;
      height: 40px;
      border: 1px gray solid;
      border-radius: 3rem;
      cursor: pointer;
    }
  `;

  return (
    <Page
      divider
      title={<BackdropSVG />}
      titleMetadata={<Text>Settings</Text>}
      secondaryActions={[
        {
          content: "Plan",
          icon: PlanMajor,
          accessibilityLabel: "Secondary action label",
          onAction: () => setPlanModalOpen(true),
        }
      ]}
    >
      <style>{css}</style>
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
                Background color
              </Text>
              <Text as="p" variant="bodyMd">
                Apply a color background after foreground is removed (default white).
              </Text>
            </VerticalStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <HorizontalStack gap="4">
            <Checkbox
                label="Transparent"
                checked={useTransparent}
                onChange={toggleUseTransparent}
              />
              <div>
                <Popover
                  active={colorOpen}
                  activator={colorCircle}
                  preferredPosition='below'
                  preferredAlignment='left'
                  autofocusTarget="first-node"
                  onClose={toggleColor}
                >
                  <ColorPicker onChange={setColor} color={color} allowAlpha />
                </Popover>
                <Text>Background color</Text>
              </div>
              <Text>Used as default background color on images after removal.</Text>
            </HorizontalStack>
          </AlphaCard>
        </HorizontalGrid>
      </VerticalStack>
      <FooterHelp>
      Learn more about{' '}
        <Link url="">
          Backdrop settings
        </Link>
      </FooterHelp>
      { planModalOpen &&
        <PlanModal />
      }
    </Page>
  );
}
