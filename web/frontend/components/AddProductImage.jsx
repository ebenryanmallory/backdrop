import { ResourcePicker } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from "../hooks";

export function AddProductImage({ images, imageIndex, productPickerOpen, setProductPickerOpen, setToastProps }) {

    const fetch = useAuthenticatedFetch();

    return (
        <>
            <ResourcePicker 
                actionVerb="select"
                resourceType="Product"
                open={productPickerOpen}
                onSelection={async (selectPayload) => {
                    const imageURL = images[imageIndex];
                    const queryStringIndex = imageURL.indexOf('?');
                    const imageName = queryStringIndex !== -1 ? 
                        imageURL.substring(imageURL.lastIndexOf('/') + 1, queryStringIndex) : 
                        imageURL.substring(imageURL.lastIndexOf('/') + 1);
                    selectPayload.selection.map(async (selection, index) => {
                        const imageResponse = await fetch('/api/add-product-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                product_id: selection.id,
                                image_url: imageURL,
                                image_name: imageName
                            })
                        })
                        if (!imageResponse.ok) {
                            throw new Error(imageResponse.statusText);
                        }
                        const imageResponseJSON = await imageResponse.json();
                        if (imageResponseJSON?.message && imageResponseJSON?.message.length > 0 &&
                            imageResponseJSON?.message[0]?.id) {
                                setToastProps({
                                    content: "New image added to product",
                                    error: false
                                });
                            }
                    });
                    setProductPickerOpen(false);
                }}
                showHidden={true}
                showDraft={true}
                showVariants={true}
                selectMultiple={true}
                onCancel={() => setProductPickerOpen(false)}
            />
        </>
    )
}