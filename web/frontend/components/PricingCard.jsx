import { useState } from "react";
import {
  AlphaCard,
  AlphaStack,
  Box,
  SkeletonDisplayText,
  SkeletonBodyText,
  Bleed,
  Text,
  Divider
} from "@shopify/polaris";
import { SkeletonLabel } from "../components/SkeletonLabel";
import { useAppQuery } from "../hooks";

export function PricingCard() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    refetch: refetchFreeCount,
    isLoading: isLoadingFreeCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/get-user-free-count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  return (
    <>
      <AlphaCard roundedAbove="sm">
        <AlphaStack gap="4">
          { isLoading &&
          <SkeletonDisplayText size="small" />
          }
          { !isLoading &&
            <>
              <Text>Pricing</Text>
            </>
          }
          <Box border="divider" borderRadius="base" minHeight="2rem" />
          <Box>
            <Bleed marginInline={{ xs: 4, sm: 5 }}>
              <Divider borderStyle="divider" />
            </Bleed>
          </Box>
          { isLoading &&
            <SkeletonLabel />
          }
          { !isLoading &&
            <>
              { data && data.plan_type === 'free' && data.free_count <= 5 &&
                <Text>You have { 5 - data.free_count } free images left.</Text>
              }
              <Text>Upgrade / change plan</Text>
              <Text>$10 plan - up to 100 images / $20 - up to 250 images</Text>
            </>
          }
          <Divider borderStyle="divider" />
          <SkeletonBodyText />
          { !isLoading &&
            <>
              <Text>Manage subscription</Text>
            </>
          }
        </AlphaStack>
      </AlphaCard>
    </>
  );
}
