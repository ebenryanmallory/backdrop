import {
  Card,
  Checkbox,
  ColorPicker,
  Popover,
  HorizontalStack,
  Text,
  Box,
  Divider,
  hsbToHex
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from 'react';

export function ColorCard({ setShowSavebar, color, setColor, useTransparent, setUseTransparent }) {
  
  const popoverRef = useRef(null);

  const [colorOpen, setColorOpen] = useState(false);
  const [hexColor, setHexColor] = useState('transparent');

  const toggleColor = useCallback(() => {
    setColorOpen((colorOpen) => !colorOpen);
  }, []);

  useEffect(() => {
    setHexColor(hsbToHex(color));
  }), [color];

  const toggleUseTransparent = useCallback((updatedToggle) => {
    setUseTransparent(updatedToggle);
    setShowSavebar(true);
  }, []);

  const colorCircle = (
    <div 
      ref={popoverRef}
      onClick={useTransparent === false ? toggleColor : null}
      className={`color-circle ${useTransparent === true ? 'color--disabled' : 'cursor-pointer'}`}
    >
    </div>
  );

  const css = `
  .color--disabled {
    background: linear-gradient(to bottom right,var(--p-color-bg) calc(50% - 0.125rem),var(--p-color-border-subdued) calc(50% - 0.125rem) calc(50% + 0.125rem),var(--p-color-bg) calc(50% + 0.125rem)) !important;
  }
  .color-circle {
    background: ${hexColor};
    width: 1.7rem;
    height: 1.7rem;
    border: 1px gray solid;
    border-radius: 3rem;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .Polaris-HorizontalStack {
    align-items: center;
  }
`;

  return (
    <Card roundedAbove="sm">
      <style>{css}</style>
      <HorizontalStack gap="3">
        <Box padding={'1'}>
          <Checkbox
            label="Transparent"
            checked={useTransparent}
            onChange={toggleUseTransparent}
          />
        </Box>
        <HorizontalStack gap="3">
          <Popover
            active={colorOpen}
            activator={colorCircle}
            preferredPosition='below'
            preferredAlignment='left'
            autofocusTarget="first-node"
            onClose={toggleColor}
          >
            <ColorPicker onChange={(color) => {
              setColor(color);
              setShowSavebar(true);
            }} color={color} />
            <Box padding="2">
              <Text>{hexColor}</Text>
            </Box>
          </Popover>
          <Text>Background color</Text>
        </HorizontalStack>
      </HorizontalStack>
      <Box padding="1" />
      { useTransparent === false &&
        <Text>Background will be a solid color. Solid white denotes product photography.</Text>
      }
      { useTransparent === true &&
        <Text>Background will show transparency. PNG images will have larger file sizes.</Text>
      }
    </Card>
  );
}
