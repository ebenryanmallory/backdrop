import { ResourcePicker } from '@shopify/app-bridge-react';

export function ImportCollectionImage({ files, setFiles, collectionPickerOpen, setCollectionPickerOpen }) {

    return (

        <ResourcePicker
            actionVerb="select"
            resourceType="Collection"
            open={collectionPickerOpen}
            onSelection={async (selectPayload) => {
                selectPayload.selection.map(async(selection) => {
                    const imageURL = selection.image.originalSrc;
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