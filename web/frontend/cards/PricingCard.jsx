import { useState } from "react";
import {
  Card,
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
      <Card roundedAbove="sm">
        <VerticalStack gap="4">
          <Text fontWeight="semibold">Pricing</Text>
          <Box>
            <Bleed marginInline={{ xs: 4, sm: 5 }}>
              <Divider borderStyle="divider" />
            </Bleed>
          </Box>
          { isLoading &&
            <SkeletonLabel />
          }
          { !isLoading && data && data.plan_type === 'free' && data.free_count > 0 &&
            <>
              <Text>Free - up to 5 images</Text>
              <Text>Professional - up to 50 images monthly, $10</Text>
              <Text>Studio - up to 100 images monthly, $20</Text>
            </>
          }
          { !isLoading && data && data.plan_type === 'professional' && data.free_count > 0 &&
            <>
              <Text>Professional plan</Text>
              <Text>You have { data.free_count } images left.</Text>
            </>
          }
          { !isLoading && data && data.plan_type === 'studio' && data.free_count > 0 &&
            <>
              <Text>Studio plan</Text>
              <Text>You have { data.free_count } images left.</Text>
            </>
          }
          <Divider borderStyle="divider" />

          { !isLoading && data && data.plan_type === 'free' && data.free_count > 0 &&
            <Text>You have { data.free_count } free images left.</Text>
          }
          { !isLoading && data && data.plan_type === 'free' && data.free_count === 0 &&
            <Text>You have used all your free images.&nbsp;
              <Link onClick={() => setPlanModalOpen(true)} monochrome removeUnderline={true}>
                Upgrade
              </Link>
            </Text>
          }
          <Link onClick={() => setPlanModalOpen(true)} monochrome removeUnderline={true}>
            Manage subscription
          </Link>
        </VerticalStack>
      </Card>
    </>
  );
}

export default PricingCard;
