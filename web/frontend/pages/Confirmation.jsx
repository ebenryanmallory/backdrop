import { Card, EmptyState, Page, Spinner, Frame, Loading, Link } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";

export default function PurchaseConfirmation() {
  
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(true);
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [confirmationURL, setConfirmationURL] = useState('');
  const [noID, setNoID] = useState(false);

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
        if (confirmationResponseJSON?.confirmationURL) {
          setConfirmationURL(confirmationResponseJSON?.confirmationURL)
        }
        if (confirmationResponseJSON?.message = 'ID not found') {
          setNoID(true)
        }
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
      <div style={{height: '100px'}}>
        <Frame>
          <Card>
            <EmptyState heading="Thank you for your purchase">
              { !isLoading &&
                <>
                  <Loading />
                  <Spinner></Spinner>
                </>
              }
              <p>
                Check the some examples on how to get started.
              </p>
              { confirmationURL !== '' &&
                <p style={{ textAlign: "center" }}>
                  Your order status is still pending. Head on back to your{' '}
                  <Link monochrome url={confirmationURL}
                    external removeUnderline={true}>
                    order page.
                  </Link>
                </p>
              }
              { noID &&
                <p style={{ textAlign: "center" }}>
                  Your session expired. Please restart upgrade from the plan modal.
                </p>
              }
            </EmptyState>
          </Card>
        </Frame>
      </div>
    </Page>
  );
}
