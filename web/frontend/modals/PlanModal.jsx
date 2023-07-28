import {
    Modal,
    Text,
    HorizontalGrid,
    Card,
    DescriptionList
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { Free } from "../assets";
import { Professional } from "../assets";
import { Studio } from "../assets";

export function PlanModal({ setPlanModalOpen }) {
  
    const emptyToastProps = { content: null };
    
    const fetch = useAuthenticatedFetch();
    const freeRef = useRef(null);
    const professionalRef = useRef(null);
    const studioRef = useRef(null);

    const [toastProps, setToastProps] = useState(emptyToastProps);
    const [isLoading, setIsLoading] = useState(true);
    const [targetPlan, setTargetPlan] = useState('free');
    const [active, setActive] = useState(true);
    const toggleActive = useCallback(() => {
        setPlanModalOpen(false);
        setActive((active) => !active)
    }, []);

    const {
        data,
        refetch: refetchPreferences,
        isLoading: isLoadingPreferences,
        isRefetching: isRefetchingPreferences,
      } = useAppQuery({
        url: "/api/get-preferences",
        reactQueryOptions: {
          onSuccess: () => {
            setIsLoading(false);
          },
        },
      });

    useEffect(() => {
        data && data.plan_type && 
            document.querySelectorAll('.Polaris-Modal-Section .Polaris-Box').forEach(card => card.classList.remove('border')) && 
            setTargetPlan(data.plan_type);
        data && data.plan_type === 'free' && freeRef.current.firstElementChild.classList.add('border')
        data && data.plan_type === 'professional' && professionalRef.current.firstElementChild.classList.add('border')
        data && data.plan_type === 'studio' && studioRef.current.firstElementChild.classList.add('border')
    }, [data]);

    const borderSelect = (selected) => {
        document.querySelectorAll('.Polaris-Modal-Section .Polaris-Box').forEach(card => card.classList.remove('border'));
        selected.closest('.Polaris-Box').classList.add('border')
    }

    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );

    const updatePlan = async () => {
        if (data && data.userNotFound) {
            const userResponse = await fetch("/api/create-user");
            if (!userResponse.ok) {
              throw new Error(userResponse.statusText);
            }
        }
        if (data && data.plan_type === 'free' || (data.plan_type === 'professional' && targetPlan === 'studio')) {
            const createSubscriptionResponse = await fetch("/api/create-subscription", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({targetPlan: targetPlan})
            })
            const jsonContent = await createSubscriptionResponse.json();
            if (!createSubscriptionResponse.ok) {
                setToastProps({
                    content: "There was an error updating your plan",
                    error: true
                });
            }
            if (jsonContent.message.includes('/RecurringApplicationCharge/confirm_recurring_application_charge?')) {
                window.parent.location.href = jsonContent.message;
            } else {
                setToastProps({
                    content: "There was an error updating your plan",
                    error: true
                });
            }
        }
        if (data && (data.plan_type === 'professional' || data.plan_type === 'studio') && targetPlan === 'free') {
            const createSubscriptionResponse = await fetch("/api/cancel-subscription", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetPlan: targetPlan })
            })
            const jsonContent = await createSubscriptionResponse.json();
            if (!createSubscriptionResponse.ok) {
                setToastProps({
                    content: "There was an error updating your plan",
                    error: true
                });
            }
            setToastProps({
                content: jsonContent.message
            });
            toggleActive();
        }
    };

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
                onAction: updatePlan
            }}
            secondaryActions={[
            {
                content: 'Cancel',
                onAction: toggleActive
            },
            ]}
        >
            <style>{css}</style>
            {toastMarkup}
            <Modal.Section>
                <HorizontalGrid gap="4" columns={3}>
                    <div onClick={(e) => {
                        borderSelect(e.target);
                        setTargetPlan('free')
                    }} ref={freeRef}>
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
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Up to 5 images',
                                    },
                                    {
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Full functionality',
                                    },
                                    {
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Free forever',
                                    },
                                    {
                                        term: <div style={{ textAlign: 'right' }}>ⓧ</div>,
                                        description: 'Intended only for feature and quality demonstration purposes.',
                                    }
                                ]}
                            />
                        </Card>
                    </div>
                    <div onClick={(e) => {
                        borderSelect(e.target);
                        setTargetPlan('professional');
                        }} ref={professionalRef}>
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
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Up to 50 images per month',
                                    },
                                    {
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Full resolution images',
                                    }
                                ]}
                            />
                        </Card>
                    </div>
                    <div onClick={(e) => {
                        borderSelect(e.target);
                        setTargetPlan('studio');
                        }} ref={studioRef}>
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
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Up to 100 images per month',
                                    },
                                    {
                                        term: <div style={{ textAlign: 'right' }}>✓</div>,
                                        description: 'Full resolution images',
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

export default PlanModal;
