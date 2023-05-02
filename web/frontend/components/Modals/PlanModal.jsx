import {
    Modal,
    Text,
    HorizontalGrid,
    AlphaCard
} from "@shopify/polaris";
import { useState, useCallback } from 'react';

export function PlanModal({ setPlanModalOpen }) {
  
    const [active, setActive] = useState(true);
    const toggleActive = useCallback(() => {
        setPlanModalOpen(false);
        setActive((active) => !active)
    }, []);

    return (
        <Modal
            large
            open={active}
            onClose={toggleActive}
            title="Current Plan"
            primaryAction={{
            content: 'Update plan',
            onAction: toggleActive,
            }}
            secondaryActions={[
            {
                content: 'Cancel',
                onAction: toggleActive,
            },
            ]}
        >
            <Modal.Section>
                <HorizontalGrid gap="4" columns={3}>
                    <AlphaCard background="bg-subdued">
                        <Text as="h2" variant="bodyMd">
                            Free
                        </Text>
                    </AlphaCard>
                    <AlphaCard background="bg-subdued">
                        <Text as="h2" variant="bodyMd">
                            Premium
                        </Text>
                    </AlphaCard>
                    <AlphaCard background="bg-subdued">
                        <Text as="h2" variant="bodyMd">
                            Pro
                        </Text>
                    </AlphaCard>
                </HorizontalGrid>
            </Modal.Section>
        </Modal>
    )
}