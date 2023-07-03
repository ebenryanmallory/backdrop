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
    setCollectionPickerOpen, setProductPickerOpen, refetchProducts }) {
  
    const css = `
        .Polaris-Modal-Dialog__Modal .Polaris-Box {
            border-color: var(--p-color-bg-inverse);
        }
        .Polaris-Modal-Dialog__Modal {
            background-color: #1a1a1a;
            color: #f1f1f1;
        }
        .flex {
            display: flex;
        }
        .grid {
            display: grid;
        }
        .w-full {
            width: 100%
        }
        .items-center {
            align-items: center;
        }
        .justify-center {
            justify-items: center;
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
        .lightbox-image {
            max-height: 70vh;
            width: auto;
            max-width: 100%;
        }
    `;
    
    return (
        <Modal
            title={`Image ${ imageIndex + 1 } of ${ images.length }`}
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
                refetchProducts={refetchProducts}
            />}
        >
            <style>{css}</style>
            <Modal.Section className="modal-section">
                <HorizontalGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="4">
                    <VerticalStack className="bg-inverse">
                        <div className="flex items-center justify-center relative">
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
                            <div className="grid w-full items-center justify-center">
                                <img
                                    src={images[imageIndex]}
                                    className="lightbox-image"
                                />
                            </div>
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