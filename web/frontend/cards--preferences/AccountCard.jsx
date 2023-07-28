import {
  Card,
  Button,
  HorizontalStack,
  Text,
  Modal,
  Box
} from "@shopify/polaris";
import {useState, useCallback} from 'react';
import { useAuthenticatedFetch } from "../hooks";

export function AccountCard({ setToastProps }) {

  const [modalOpen, setModalOpen] = useState(false);

  const fetch = useAuthenticatedFetch();

  const css = `
    .Polaris-HorizontalStack {
      align-items: center;
    }
  `;

  const handleModalChange = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);

  const handleClose = () => {
    handleModalChange();
  };


  const deleteAllData = async () => {
    const userResponse = await fetch("/api/delete-all-data", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const userResponseText = await userResponse.text();
    console.log(userResponseText)
    if (userResponse.ok && userResponseText === 'OK') {
      handleClose();
      setToastProps({
        content: "All user data has been deleted"
      });
    } else {
      handleClose();
      setToastProps({
        content: userResponseText,
        error: true
      });
    }
  }

  return (
    <>
    <Card roundedAbove="sm">
      <style>{css}</style>
      <HorizontalStack gap="3">
        <Button destructive onClick={() => setModalOpen(true)}>Delete All Data</Button>
      </HorizontalStack>
      <Box padding="1" />
      <Text>Warning: this action is irreversible and takes effect immediately.</Text>
    </Card>
    { modalOpen &&
      <div style={{height: '500px'}}>
        <Modal
          open={modalOpen}
          onClose={handleClose}
          title="Delete All Backdrop Data?"
          primaryAction={{
            content: 'Delete Data',
            onAction: deleteAllData,
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleClose,
            },
          ]}
        >
          <Modal.Section>
            <Text>The Backdrop app saves images as files under your store's content - these images will not be deleted</Text>
            <Text>No images used in your public facing pages will be affected or deleted.</Text>
            <Text>The app will reset to it's original default state.</Text>
            <Text>This can't be undone.</Text>
          </Modal.Section>
        </Modal>
      </div>
    }
    </>
  );
}

export default AccountCard;
