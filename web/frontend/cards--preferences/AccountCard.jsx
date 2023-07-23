import {
  Card,
  Button,
  HorizontalStack,
  Text,
  Box
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function AccountCard({ setToastProps}) {

  const fetch = useAuthenticatedFetch();

  const css = `
    .Polaris-HorizontalStack {
      align-items: center;
    }
  `;

  const deleteAllData = async () => {
    const userResponse = await fetch("/api/delete-all-data", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const userResponseText = await userResponse.text();
    console.log(userResponseText)
    if (userResponse.ok && userResponseText === 'OK') {
      setToastProps({
        content: "All user data has been deleted"
      });
    } else {
      setToastProps({
        content: userResponseText,
        error: true
      });
    }
  }

  return (
    <Card roundedAbove="sm">
      <style>{css}</style>
      <HorizontalStack gap="3">
        <Button destructive onClick={deleteAllData}>Delete All Data</Button>
      </HorizontalStack>
      <Box padding="1" />
      <Text>Warning: this action is irreversible and takes effect immediately.</Text>
    </Card>
  );
}

export default AccountCard;
