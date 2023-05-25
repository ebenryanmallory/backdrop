import {
    Modal,
    Text,
    HorizontalGrid,
    VerticalStack,
    Icon,
    Link
} from "@shopify/polaris";
import {
    ChevronLeftMinor,
    ChevronRightMinor
} from '@shopify/polaris-icons';
import { LightboxFooter } from './LightboxFooter';

export function Lightbox({ lightboxOpen, setLightboxOpen, images, imageIndex, setImageIndex, 
    setCollectionPickerOpen, setProductPickerOpen }) {
  
    const css = `
        .w-full {
            width: 100%
        }
        .h-full {
            height: 100%
        }
        .bg-inverse {
            background-color: var(--p-color-bg-inverse);
        }
        .Polaris-Modal-Dialog__Modal {
            background-color: #1a1a1a;
            color: #f1f1f1;
        }
    `;
    return (
        <Modal
            title={`Media ${ imageIndex + 1 } of ${ images.length }`}
            instant={true}
            large={true}
            fullScreen={true}
            noScroll={true}
            onClose={() => {
                setImageIndex(null);
                setLightboxOpen(false);
            }}
            open={lightboxOpen}
            footer={<LightboxFooter 
                images={images}
                imageIndex={imageIndex}
            />}
        >
            <style>{css}</style>
            <Modal.Section className="modal-section">
                <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
                    <VerticalStack
                        className="bg-inverse"
                    >
                        <div>
                            <div onClick={() => setImageIndex(imageIndex - 1)}>
                                <Icon
                                    source={ChevronLeftMinor}
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
                                    source={ChevronRightMinor}
                                    color="base"
                                    classList="cursor-pointer"
                                />
                            </div>
                        </div>
                    </VerticalStack>
                    <VerticalStack gap={{ xs: "4", md: "2" }}>
                        <Text>Push this image out to a product image, product variant image, or collection image.</Text>
                        <Link monochrome removeUnderline={true} onClick={() => {
                            setLightboxOpen(false);
                            setProductPickerOpen(true);
                        }}>
                            Push to product image
                        </Link>
                        <Link monochrome removeUnderline={true} onClick={() => {
                            setLightboxOpen(false);
                            setCollectionPickerOpen(true);
                        }}>
                            Push to collection
                        </Link>
                    </VerticalStack>
                </HorizontalGrid>
            </Modal.Section>
        </Modal>
    )
}