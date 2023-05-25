import { useState } from "react";
import {
  AlphaCard,
  VerticalStack,
  Box,
  Bleed,
  Text,
  Divider,
  Link
} from "@shopify/polaris";
import { SkeletonLabel } from "../components/SkeletonLabel";
import { useAppQuery } from "../hooks";

export function PricingCard({ setPlanModalOpen }) {
  
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
        <VerticalStack gap="4">
          <Text fontWeight="semibold">Pricing</Text>
          <Box>
            <Bleed marginInline={{ xs: 4, sm: 5 }}>
              <Divider borderStyle="divider" />
            </Bleed>
          </Box>
          <Text>Free - up to 5 images</Text>
          <Text>Pro - up to 100 images, $10</Text>
          <Text>Studio - up to 250 images, $20</Text>
          <Divider borderStyle="divider" />

          { isLoading &&
            <SkeletonLabel />
          }
          { !isLoading && data && data.plan_type === 'free' && data.free_count <= 5 &&
            <Text>You have { 5 - data.free_count } free images left.</Text>
          }
          <Link onClick={() => setPlanModalOpen(true)} monochrome removeUnderline={true}>
            Manage subscription
          </Link>
        </VerticalStack>
      </AlphaCard>
    </>
  );
}
