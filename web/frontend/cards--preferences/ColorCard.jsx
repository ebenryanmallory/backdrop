import {
  AlphaCard,
  Checkbox,
  ColorPicker,
  Popover,
  HorizontalStack,
  Text,
  Box
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from 'react';
import { hbsaToHex } from '../shared/convertToHex';

export function ColorCard() {
  const [colorOpen, setColorOpen] = useState(false);
  const [useTransparent, setUseTransparent] = useState(false);
  const [color, setColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0
  });
  const [hexColor, setHexColor] = useState('transparent');

  const toggleColor = useCallback(() => setColorOpen((colorOpen) => !colorOpen), []);

  useEffect(() => {
    setHexColor(hbsaToHex(color))
  }), [color];

  const colorCircle = (
    <div 
      onClick={toggleColor}
      className="color--disabled color-circle"
    >
    </div>
  );

  const toggleUseTransparent = useCallback(
    (updatedToggle) => setUseTransparent(updatedToggle),
    [],
  );

  const css = `
  .color--disabled {
    background: linear-gradient(to bottom right,var(--p-color-bg) calc(50% - 0.125rem),var(--p-color-border-subdued) calc(50% - 0.125rem) calc(50% + 0.125rem),var(--p-color-bg) calc(50% + 0.125rem));
  }
  .color-circle {
    background: hsl(${color.hue}, ${color.saturation * 100}%, ${color.brightness * 100}%);
    width: 40px;
    height: 40px;
    border: 1px gray solid;
    border-radius: 3rem;
    cursor: pointer;
  }
`;

  return (
    <AlphaCard roundedAbove="sm">
      <HorizontalStack gap="4">
        {useTransparent === false &&
          <HorizontalStack>
            <style>{css}</style>
            <Popover
              active={colorOpen}
              activator={colorCircle}
              preferredPosition='below'
              preferredAlignment='left'
              autofocusTarget="first-node"
              onClose={toggleColor}
            >
              <ColorPicker onChange={(color) => {
                setColor(color)
              }} color={color} />
              <Text>{hexColor}</Text>
            </Popover>
            <Text>Background color</Text>
          </HorizontalStack>
        }
        <Checkbox
          label="Transparent"
          checked={useTransparent}
          onChange={toggleUseTransparent}
        />
      </HorizontalStack>
      <Box padding="4" />
      { useTransparent === false &&
        <Text>Use for solid color background. Solid white denotes product images.</Text>
      }
      { useTransparent === true &&
        <Text>Use for creating a composite background. PNG images will have larger file sizes.</Text>
      }
    </AlphaCard>
  );
}
