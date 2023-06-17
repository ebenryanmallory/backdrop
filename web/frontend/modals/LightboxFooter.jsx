import {
    HorizontalStack,
    Icon
} from "@shopify/polaris";
import {
    DeleteMajor,
    PageDownMajor
} from '@shopify/polaris-icons';
import { deleteImage } from "../shared/deleteImage";
import { downloadImage } from "../shared/downloadImage";
import { useAuthenticatedFetch } from "../hooks";

export const LightboxFooter = ({ images, imageIndex, refetchProducts }) => {

    const fetch = useAuthenticatedFetch();

    return (
        <HorizontalStack gap="2">
            <div className="cursor-pointer"
                onClick={async () => {
                    await deleteImage(images, imageIndex, fetch);
                    refetchProducts();
                }}>
                <Icon
                    source={DeleteMajor}
                    color="base"
                />
            </div>
            <div className="cursor-pointer"
                onClick={() => downloadImage(images, imageIndex)}>
                <Icon
                    source={PageDownMajor}
                    color="base"
                />
            </div>
        </HorizontalStack>
    )
}
