import { ResourcePicker } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from "../hooks";

export function AddCollectionImage({ images, imageIndex, collectionPickerOpen, setCollectionPickerOpen, setLightboxOpen, setToastProps }) {

    const fetch = useAuthenticatedFetch();

    return (

        <ResourcePicker
            actionVerb="select"
            resourceType="Collection"
            open={collectionPickerOpen}
            onSelection={async (selectPayload) => {
                const imageResponse = await fetch('/api/update-collection-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        collection_id: selectPayload.selection[0].id,
                        image_url: images[imageIndex]
                    })
                })
                if (!imageResponse.ok) {
                    setToastProps({
                        content: "Could not update collection image. Please try again.",
                        error: true
                      });
                    return
                }
                const imageResponseJSON = await imageResponse.json();
                setToastProps(imageResponseJSON);
                setCollectionPickerOpen(false);
                setLightboxOpen(false);
            }}
            showHidden={true}
            showDraft={true}
            showVariants={true}
            selectMultiple={true}
            onCancel={() => {
                setCollectionPickerOpen(false);
                setLightboxOpen(true);
            }}
        />
    )
}