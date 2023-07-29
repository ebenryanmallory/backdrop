import { 
  Card, 
  EmptyState, 
  Page, 
  Spinner, 
  Frame,
  Box,
  Loading, 
  Link 
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { useEffect, useState } from "react";
import { dots } from "../assets";
import { confettiRibbon } from "../assets";

export default function PurchaseConfirmation() {
  
  const fetch = useAuthenticatedFetch();

  const modifyWebhooks = async () => {
    const modifyResponse = await fetch('/api/modify-webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          hello: 'world'
        })
    })
  }
  window.modifyWebhooks = modifyWebhooks;
  
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOK, setPurchaseOK] = useState(false);
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
        if (confirmationResponseJSON?.message.includes('https://')) {
          setConfirmationURL(confirmationResponseJSON.message);
          setIsLoading(false);
        }
        if (confirmationResponseJSON?.message === 'ID not found') {
          setNoID(true);
          setIsLoading(false);
        }
        if (confirmationResponseJSON?.message === 'ok') {
          setIsLoading(false);
          setPurchaseOK(true);
        }
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
            <EmptyState 
              heading={purchaseOK ? "Thank you for your purchase" : ''}
              image={purchaseOK ? confettiRibbon : dots}
            >
              { isLoading &&
                <>
                  <Loading />
                  <Spinner></Spinner>
                  <p style={{ textAlign: "center" }}>
                    Just checking on a couple things...
                  </p>
                </>
              }
              { confirmationURL !== '' &&
                <>
                  <Box padding="4"></Box>
                  <p style={{ textAlign: "center" }}>
                    Your order status is still pending. Head on back to your{' '}
                    <Link monochrome onClick={() => window.parent.location.href = confirmationURL}
                      external removeUnderline={true}>
                      order page.
                    </Link>
                  </p>
                </>
              }
              { noID &&
                <>
                  <Box padding="4"></Box>
                  <p style={{ textAlign: "center" }}>
                    Your session expired. Please restart upgrade from the plan modal.
                  </p>
                </>
              }
              { purchaseOK &&
                <>
                  <Box padding="4"></Box>
                  <p style={{ textAlign: "center" }}>
                    Congratulations! If you need a refresher on how to get started, visit
                    <Link monochrome url="https://backdrop.motionstoryline.com/quickstart-guide/"
                      external removeUnderline={true} target="_blank">
                      the documentation.
                    </Link>
                  </p>
                </>
              }
            </EmptyState>
          </Card>
        </Frame>
      </div>
    </Page>
  );
}
