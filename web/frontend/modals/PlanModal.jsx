import {
    Modal,
    Text,
    HorizontalGrid,
    Card,
    DescriptionList
} from "@shopify/polaris";
import { useState, useCallback } from 'react';
import { useAppQuery } from "../hooks";
import { Free } from "../assets";
import { Professional } from "../assets";
import { Studio } from "../assets";

export function PlanModal({ setPlanModalOpen }) {
  
    const [isLoading, setIsLoading] = useState(true);
    const [active, setActive] = useState(true);
    const toggleActive = useCallback(() => {
        setPlanModalOpen(false);
        setActive((active) => !active)
    }, []);

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

    const borderSelect = (selected) => {
        document.querySelectorAll('.Polaris-Modal-Section .Polaris-Box').forEach(card => card.classList.remove('border'));
        selected.closest('.Polaris-Box').classList.add('border')
    }

    const css = `
        .Polaris-Modal-Section .Polaris-Box:hover {
            cursor: pointer;
        }
        .Polaris-Modal-Section .Polaris-Box {
            border: 1px #d7d7d7 solid;
        }
        .border {
            border: 1px #656565 solid !important;
        }
    `;

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
            <style>{css}</style>
            <Modal.Section>
                <HorizontalGrid gap="4" columns={3}>
                    <div onClick={(e) => borderSelect(e.target)} className="free">
                        <Card className="hover-card"
                            background={"bg-subdued"}>
                            <Text as="h2" variant="headingXl">
                                Free
                            </Text>
                            <img
                                alt=""
                                width="100%"
                                height="100%"
                                style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                                padding: '1rem'
                                }}
                                src={Free}
                            />
                            <DescriptionList
                                items={[
                                    {
                                        description:
                                            '✓ Up to 5 images',
                                    },
                                    {
                                    description:
                                        '✓ Full functionality',
                                    },
                                    {
                                    description:
                                        '✓ Free forever',
                                    },
                                    {
                                    description:
                                        'Ⓧ Intended only for feature and quality demonstration purposes.',
                                    }
                                ]}
                            />
                        </Card>
                    </div>
                    <div onClick={(e) => borderSelect(e.target)} className="professional]">
                        <Card background="bg-subdued">
                            <Text as="h2" variant="headingXl">
                                Professional
                            </Text>
                            <img
                                alt=""
                                width="100%"
                                height="100%"
                                style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                                padding: '1rem'
                                }}
                                src={Professional}
                            />
                            <DescriptionList
                                items={[
                                    {
                                    description:
                                        '✓ Up to 100 images per month',
                                    },
                                    {
                                    description:
                                        '✓ Billed only after you go over your free tier limit',
                                    }
                                ]}
                            />
                        </Card>
                    </div>
                    <div onClick={(e) => borderSelect(e.target)} className="studio">
                        <Card background="bg-subdued">
                            <Text as="h2" variant="headingXl">
                                Studio
                            </Text>
                            <img
                                alt=""
                                width="100%"
                                height="100%"
                                style={{
                                objectFit: 'contain',
                                objectPosition: 'center'
                                }}
                                src={Studio}
                            />
                            <DescriptionList
                                items={[
                                    {
                                    description:
                                        '✓ Up to 250 images per month',
                                    },
                                    {
                                    description:
                                        '✓ Billed only after you go over your professional tier limit, or you are billed at the lower rate.',
                                    }
                                ]}
                            />
                        </Card>
                    </div>
                </HorizontalGrid>
            </Modal.Section>
        </Modal>
    )
}