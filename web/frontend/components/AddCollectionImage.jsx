import { ResourcePicker } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from "../hooks";

export function AddCollectionImage({ images, imageIndex, collectionPickerOpen, setCollectionPickerOpen }) {

    const fetch = useAuthenticatedFetch();

    return (

        <ResourcePicker
            actionVerb="select"
            resourceType="Collection"
            open={collectionPickerOpen}
            onSelection={async (selectPayload) => {
                console.log(selectPayload.selection[0].id)
                const imageResponse = await fetch('/api/add-collection-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        collection_id: selectPayload.selection[0].id,
                        image_id: selectPayload.selection[0].image.id,
                        image_url: images[imageIndex]
                    })
                })
                if (!imageResponse.ok) {
                    throw new Error(imageResponse.statusText);
                }
                const imageResponseJSON = await imageResponse.json();
                console.log(imageResponseJSON?.message)
                setCollectionPickerOpen(false);
            }}
            showHidden={true}
            showDraft={true}
            showVariants={true}
            selectMultiple={true}
            onCancel={() => setCollectionPickerOpen(false)}
        />
    )
}