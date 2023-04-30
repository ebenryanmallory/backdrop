import {
    Modal,
    Text,
    HorizontalGrid,
    VerticalStack,
    Divider
} from "@shopify/polaris";
import { useState } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';

export function Lightbox({ lightboxOpen, setLightboxOpen, images }) {
  
    const [pickerOpen, setPickerOpen] = useState(false);

    const Footer = () => {
        return (
            <p>Footer content</p>
        )
    }
    
    return (
        <Modal
            title="Image Name"
            titleHidden
            large={true}
            fullScreen={true}
            noScroll={true}
            onClose={() => setLightboxOpen(false)}
            open={lightboxOpen}
            footer={<Footer />}
        >
            <Modal.Section>
                <Divider />
                <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
                    <VerticalStack>
                        <div>
                            <Text>Previous</Text>
                            <img src={images[0]} />
                            <Text>Next</Text>
                        </div>
                    </VerticalStack>
                    <VerticalStack gap={{ xs: "4", md: "2" }}>
                        <Text>Actions:</Text>
                        <Divider />
                        <Text>Icons:</Text>
                        <Text>Download</Text>
                        <Text onClick={() => setPickerOpen(true)}>
                            Push to product image
                        </Text>
                        <ResourcePicker 
                            resourceType="Product"
                            open={pickerOpen}
                            onSelection={(selectPayload) => {
                                console.log(selectPayload.id)
                                console.log(selectPayload.selection)
                            }}
                            showHidden={true}
                            showDraft={true}
                            showVariants={true}
                            selectMultiple={true}
                            onCancel={() => setPickerOpen(false)}
                        />
                        <Text>Push to collection</Text>
                    </VerticalStack>
                </HorizontalGrid>
            </Modal.Section>
        </Modal>
    )
}