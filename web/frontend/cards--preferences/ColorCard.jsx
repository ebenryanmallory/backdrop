import {
  Card,
  Checkbox,
  ColorPicker,
  Popover,
  HorizontalStack,
  Text,
  Box,
  hsbToHex
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from 'react';

export function ColorCard({ setShowSavebar, color, setColor, useTransparent, setUseTransparent, bypassRemoval, setBypassRemoval }) {
  
  const popoverRef = useRef(null);

  const [colorOpen, setColorOpen] = useState(false);
  const [hexColor, setHexColor] = useState('transparent');

  useEffect(() => {
    setHexColor(hsbToHex(color));
  }), [color];

  const toggleColor = useCallback(() => {
    setColorOpen((colorOpen) => !colorOpen);
  }, []);

  const toggleBypassRemoval = useCallback((updatedToggle) => {
    setBypassRemoval(updatedToggle);
    setShowSavebar(true);
  }, []);

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
      <Box padding={'1'}>
        <Text>{bypassRemoval}</Text>
        <Checkbox
          label="Bypass background removal step"
          checked={bypassRemoval}
          onChange={toggleBypassRemoval}
        />
      </Box>
      { bypassRemoval === false &&
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
      }
      <Box padding="1" />
      { useTransparent === false && bypassRemoval === false &&
        <Text>Background will be a solid color. Solid white denotes product photography.</Text>
      }
      { useTransparent === true && bypassRemoval === false &&
        <Text>Background will show transparency. PNG images will have larger file sizes.</Text>
      }
      { bypassRemoval === true &&
        <Text>Bypassing background removal is useful for simple image compression.</Text>
      }
    </Card>
  );
}

export default ColorCard;
