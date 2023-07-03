import { Card, EmptyState, Page } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { notFoundImage } from "../assets";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";

export default function PurchaseConfirmation() {
  
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(true);
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);

  useEffect(() => {
    async function updateSubscription() {
      const confirmationResponse = await fetch('/api/confirm-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            hello: 'world'
        })
      })
      if (!confirmationResponse.ok) {
          setToastProps({
              content: "Please refresh your browser from this page.",
              error: true
            });
      } else {
        const confirmationResponseJSON = await confirmationResponse.json();
        setIsLoading(false);
      }
    }
    updateSubscription();
  }, []);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  return (
    <Page>
      {toastMarkup}
      <Card>
        <EmptyState
          heading="Thank you for your purchase"
          image={isLoading ? notFoundImage : null}
        >
          <p>
            Check the some examples on how to get started.
          </p>
        </EmptyState>
      </Card>
    </Page>
  );
}
