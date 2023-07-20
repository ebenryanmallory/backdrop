import {
  Card,
  VerticalStack,
  RangeSlider,
  Checkbox,
  Text,
  Box
} from "@shopify/polaris";
import { useCallback, useEffect } from 'react';

export function CompressionCard({ setShowSavebar, useCompression, setUseCompression, compressionAmount, setCompressionAmount, data }) {
  
  useEffect(() => {
    setUseCompression(data.use_compression)
    setCompressionAmount(100 - data.compression)
  }, []);

  const toggleUseCompression = useCallback(
    (updatedToggle) => {
      setUseCompression(updatedToggle)
      setShowSavebar(true);
    }, []);
  const setCompressionValue = useCallback(
    (updatedValue) => {
      setCompressionAmount(updatedValue)
      setShowSavebar(true);
    }, []);

  return (
    <Card roundedAbove="sm">
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
            value={compressionAmount}
            onChange={setCompressionValue}
            prefix={<p>Amount</p>}
            suffix={
              <p
                style={{
                  minWidth: '24px',
                  textAlign: 'right',
                }}
              >
                {compressionAmount}
              </p>
            }
          />
        }
      </VerticalStack>
      <Box padding="2" />
      { useCompression === false &&
        <Text>Compression is recommended for web use.</Text>
      }
      { useCompression === true &&
        <Text>A default of 30 provides a high amount of compression with a minimal amount of noticeable loss of quality.</Text>
      }
    </Card>
  );
}

export default CompressionCard;
