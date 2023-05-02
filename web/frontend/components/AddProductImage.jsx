import { ResourcePicker } from '@shopify/app-bridge-react';

export function AddProductImage({ images, imageIndex, productPickerOpen, setProductPickerOpen }) {

    return (

        <ResourcePicker 
        resourceType="Product"
        open={productPickerOpen}
        onSelection={(selectPayload) => {
            console.log(selectPayload.id)
            console.log(selectPayload.selection)
        }}
        showHidden={true}
        showDraft={true}
        showVariants={true}
        selectMultiple={true}
        onCancel={() => setProductPickerOpen(false)}
        />
    )
}