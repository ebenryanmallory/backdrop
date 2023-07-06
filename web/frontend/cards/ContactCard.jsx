import {
  Card,
  VerticalStack,
  Box,
  Bleed,
  Divider,
  Text,
  Link
} from "@shopify/polaris";

export function ContactCard() {

  return (
    <Card roundedAbove="sm">
      <VerticalStack gap="4">
        <Text fontWeight="semibold">Support</Text>
        <Box>
          <Bleed marginInline={{ xs: 4, sm: 5 }}>
            <Divider borderStyle="divider" />
          </Bleed>
        </Box>
        <Link monochrome
          url="https://backdrop.motionstoryline.com/" 
          external={true}
          target="_blank"
          removeUnderline={true}
        >Chat</Link>
        <Link monochrome
          url="https://backdrop.motionstoryline.com/" 
          external={true}
          target="_blank"
          removeUnderline={true}
        >Contact Form</Link>
      </VerticalStack>
    </Card>
  );
}

export default ContactCard;
