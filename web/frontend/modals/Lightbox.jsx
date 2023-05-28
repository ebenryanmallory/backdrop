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
        .Polaris-Modal-Dialog__Modal .Polaris-Box {
            border-color: var(--p-color-bg-inverse);
        }
        .w-full {
            width: 100%
        }
        .h-full {
            height: 100%
        }
        .Polaris-Modal-Dialog__Modal {
            background-color: #1a1a1a;
            color: #f1f1f1;
        }
        .flex {
            display: flex;
        }
        .items-center {
            align-items: center;
        }
        .absolute {
            position: absolute;
        }
        .relative {
            position: relative;
        }
        .right-0 {
            right: 0;
        }
        .cursor-pointer {
            cursor: pointer;
        }
        .next span, .prev span {
            height: 2rem;
            width: 2rem;
        }
        .next:hover, .prev:hover {
            border: #414141 0.5px solid;
            padding-top: 5px;
            padding-bottom: 5px;
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
                        <div className="flex items-center relative">
                            <div onClick={() => {
                                if ((imageIndex - 1) >= 0) {
                                    setImageIndex(imageIndex - 1)
                                }
                            }} className="absolute cursor-pointer prev">
                                <Icon
                                    source={ChevronLeftMinor}
                                    color="base"
                                    accessibilityLabel="Previous image"
                                />
                            </div>
                            <img
                                src={images[imageIndex]}
                                className="w-full h-full"
                            />
                            <div onClick={() => {
                                if ((imageIndex + 1) < images.length) {
                                    setImageIndex(imageIndex + 1)
                                }
                            }} className="absolute right-0 cursor-pointer next">
                                <Icon
                                    source={ChevronRightMinor}
                                    color="base"
                                    accessibilityLabel="Next image"
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