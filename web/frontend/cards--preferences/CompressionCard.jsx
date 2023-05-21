import {
  AlphaCard,
  VerticalStack,
  RangeSlider,
  Checkbox,
  Text,
  Box
} from "@shopify/polaris";
import { useState, useCallback } from 'react';

export function CompressionCard() {
  const [useCompression, setUseCompression] = useState(true);
  const [rangeValue, setRangeValue] = useState(20);

  const toggleUseCompression = useCallback(
    (updatedToggle) => setUseCompression(updatedToggle),
    [],
  );
  const setCompressionValue = useCallback(
    (updatedValue) => {
      setRangeValue(updatedValue)
    },
    [],
  );

  return (
    <AlphaCard roundedAbove="sm">
      <VerticalStack gap="4">
        <Checkbox
          label="Use compression"
          checked={useCompression}
          onChange={toggleUseCompression}
        />
        { useCompression === true &&
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
        }
      </VerticalStack>
      <Box padding="4" />
      { useCompression === false &&
        <Text>Compression is recommended for web use.</Text>
      }
      { useCompression === true &&
        <Text>A default of 20 provides a high amount of compression with a minimal amount of noticeable loss of quality.</Text>
      }
    </AlphaCard>
  );
}
