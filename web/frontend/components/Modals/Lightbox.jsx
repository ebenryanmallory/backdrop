import {
    Modal,
    Text,
    HorizontalGrid,
    VerticalStack,
    Divider,
    Icon
} from "@shopify/polaris";
import {
    CircleChevronLeftMinor,
    CircleChevronRightMinor
} from '@shopify/polaris-icons';
import { useState } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { LightboxFooter } from './LightboxFooter';

export function Lightbox({ lightboxOpen, setLightboxOpen, images, imageIndex, setImageIndex }) {
  
    const [pickerOpen, setPickerOpen] = useState(false);

    const css = `
        .w-full {
            width: 100%
        }
        .h-full {
            height: 100%
        }
    `;
    return (
        <Modal
            title="Image Name"
            titleHidden
            instant={true}
            large={true}
            fullScreen={true}
            noScroll={true}
            onClose={() => {
                setImageIndex(null);
                setLightboxOpen(false);
            }}
            open={lightboxOpen}
            footer={<LightboxFooter />}
        >
            <style>{css}</style>
            <Modal.Section>
                <Divider />
                <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
                    <VerticalStack>
                        <div>
                            <div onClick={() => setImageIndex(imageIndex - 1)}>
                                <Icon
                                    source={CircleChevronLeftMinor}
                                    color="base"
                                    classList="cursor-pointer"
                                />
                            </div>
                            <img
                                src={images[imageIndex]}
                                className="w-full h-full"
                            />
                            <div onClick={() => setImageIndex(imageIndex + 1)}>
                                <Icon
                                    source={CircleChevronRightMinor}
                                    color="base"
                                    classList="cursor-pointer"
                                />
                            </div>
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