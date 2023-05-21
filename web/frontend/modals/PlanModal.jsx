import {
    Modal,
    Text,
    HorizontalGrid,
    AlphaCard,
    CalloutCard
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
                    <CalloutCard
                    title="Customize the style of your checkout"
                    illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                    primaryAction={{
                        content: 'Customize checkout',
                        url: '#',
                    }}
                    >
                    <p>Upload your store’s logo, change colors and fonts, and more.</p>
                    </CalloutCard>
                        <Text as="h2" variant="bodyMd">
                            Free
                        </Text>
                    </AlphaCard>
                    <AlphaCard background="bg-subdued">
                    <CalloutCard
                        title="Customize the style of your checkout"
                        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                        primaryAction={{
                            content: 'Customize checkout',
                            url: '#',
                        }}
                        >
                        <p>Upload your store’s logo, change colors and fonts, and more.</p>
                        </CalloutCard>
                        <Text as="h2" variant="bodyMd">
                            Premium
                        </Text>
                    </AlphaCard>
                    <AlphaCard background="bg-subdued">
                        <CalloutCard
                        title="Customize the style of your checkout"
                        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                        primaryAction={{
                            content: 'Customize checkout',
                            url: '#',
                        }}
                        >
                        <p>Upload your store’s logo, change colors and fonts, and more.</p>
                        </CalloutCard>
                        <Text as="h2" variant="bodyMd">
                            Pro
                        </Text>
                    </AlphaCard>
                </HorizontalGrid>
            </Modal.Section>
        </Modal>
    )
}