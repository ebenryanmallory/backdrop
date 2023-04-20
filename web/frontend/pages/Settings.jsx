import { 
  AlphaStack,
  Page,
  Text,
  Box,
  AlphaCard,
  Checkbox,
  Columns,
  Divider,
  useBreakpoints,
  ColorPicker,
  RangeSlider
} from "@shopify/polaris";
import { BalanceMajor } from '@shopify/polaris-icons';
import { useContextualSaveBar } from '@shopify/app-bridge-react';
import { useState, useCallback } from 'react';
import { BackdropSVG } from "../components/BackdropSVG";

export default function Settings() {
  const { smUp } = useBreakpoints();
  const [checked, setChecked] = useState(false);
  const [rangeValue, setRangeValue] = useState(20);

  const {show, hide, saveAction, discardAction} = useContextualSaveBar();

  const [color, setColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0,
    alpha: 1,
  });

  const toggleUseCompression = useCallback(
    (updatedToggle) => setChecked(updatedToggle),
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
          onAction: () => alert("Account modal"),
        }
      ]}
    >
      <AlphaStack gap={{ xs: "8", sm: "4" }}>
        <Columns columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <AlphaStack gap="4">
              <Text as="h3" variant="headingMd">
                Edge Detection
              </Text>
              <Text as="p" variant="bodyMd">
                Use higher settings for hair and fine
              </Text>
            </AlphaStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <AlphaStack gap="4">
              <Text as="p" variant="bodyMd">
                How much fine tuning is applied to edge detection
              </Text>
            </AlphaStack>
          </AlphaCard>
        </Columns>
        {smUp ? <Divider borderStyle="base" /> : null}
        <Columns columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <AlphaStack gap="4">
              <Text as="h3" variant="headingMd">
                Compression
              </Text>
              <Text as="p" variant="bodyMd">
                How much compression is set to images for web export
              </Text>
            </AlphaStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <AlphaStack gap="4">
              <Checkbox
                label="Use compression"
                checked={checked}
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
            </AlphaStack>
          </AlphaCard>
        </Columns>
        {smUp ? <Divider borderStyle="base" /> : null}
        <Columns columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 0 }}
            paddingInlineEnd={{ xs: 4, sm: 0 }}
          >
            <AlphaStack gap="4">
              <Text as="h3" variant="headingMd">
                Default background color
              </Text>
              <Text as="p" variant="bodyMd">
                Apply a color background after foreground is removed (default white).
              </Text>
            </AlphaStack>
          </Box>
          <AlphaCard roundedAbove="sm">
            <AlphaStack gap="4">
              <ColorPicker onChange={setColor} color={color} allowAlpha />
            </AlphaStack>
          </AlphaCard>
        </Columns>
      </AlphaStack>
    </Page>
  );
}
