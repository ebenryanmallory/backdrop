import { ResourcePicker } from '@shopify/app-bridge-react';

export function AddCollectionImage({ images, imageIndex, collectionPickerOpen, setCollectionPickerOpen }) {

    return (

        <ResourcePicker 
        resourceType="Collection"
        open={collectionPickerOpen}
        onSelection={(selectPayload) => {
            console.log(selectPayload.id)
            console.log(selectPayload.selection)
        }}
        showHidden={true}
        showDraft={true}
        showVariants={true}
        selectMultiple={true}
        onCancel={() => setCollectionPickerOpen(false)}
        />
    )
}