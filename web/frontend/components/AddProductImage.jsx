import { ResourcePicker } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from "../hooks";

export function AddProductImage({ images, imageIndex, productPickerOpen, setProductPickerOpen }) {

    const fetch = useAuthenticatedFetch();

    return (

        <ResourcePicker 
            actionVerb="select"
            resourceType="Product"
            open={productPickerOpen}
            onSelection={async (selectPayload) => {
                setProductPickerOpen(false)
                const imageResponse = await fetch('/api/add-product-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        product_id: selectPayload.selection[0].id,
                        image_id: selectPayload.selection[0].images[0].id,
                        image_url: images[imageIndex]
                    })
                })
                if (!imageResponse.ok) {
                    throw new Error(imageResponse.statusText);
                }
                const imageResponseJSON = await imageResponse.json();
                console.log(imageResponseJSON?.message)
                setProductPickerOpen(false);
            }}
            showHidden={true}
            showDraft={true}
            showVariants={true}
            selectMultiple={true}
            onCancel={() => setProductPickerOpen(false)}
        />
    )
}