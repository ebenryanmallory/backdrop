import { ResourcePicker } from '@shopify/app-bridge-react';
import { useAuthenticatedFetch } from "../hooks";

export function ImportProductImage({ files, setFiles, productPickerOpen, setProductPickerOpen }) {

    const fetch = useAuthenticatedFetch();

    return (

        <ResourcePicker 
            actionVerb="select"
            resourceType="Product"
            open={productPickerOpen}
            onSelection={async (selectPayload) => {
                selectPayload.selection.map(async(selection) => {
                    selection.images.map(async (image, index) => {
                        const imageURL = image.originalSrc;
                        const fileResponse = await fetch(imageURL);
                        const buffer = await fileResponse.arrayBuffer();
                        const queryStringIndex = imageURL.indexOf('?');
                        const imageName = queryStringIndex !== -1 ? 
                            imageURL.substring(imageURL.lastIndexOf('/') + 1, queryStringIndex) : 
                            imageURL.substring(imageURL.lastIndexOf('/') + 1);
                        const isPNG = imageName.includes('.png');
                        const file = new File([buffer], imageName, { type: isPNG ? "image/png" : "image/jpeg" });
                        setFiles((files) => [...files, file]); 
                    })
                })
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