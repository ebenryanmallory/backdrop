import {
    HorizontalStack,
    Icon
} from "@shopify/polaris";
import {
    DeleteMajor,
    PageDownMajor
} from '@shopify/polaris-icons';
import { deleteImage } from "../../shared/deleteImage";
import { downloadImage } from "../../shared/downloadImage";
import { useAuthenticatedFetch } from "../../hooks";

export const LightboxFooter = ({ images, imageIndex }) => {

    const fetch = useAuthenticatedFetch();

    return (
        <HorizontalStack>
            <div onClick={() => deleteImage(images, imageIndex, fetch)}>
                <Icon
                    source={DeleteMajor}
                    color="base"
                    classList="cursor-pointer"
                />
            </div>
            <div onClick={() => downloadImage(images, imageIndex)}>
                <Icon
                    source={PageDownMajor}
                    color="base"
                    classList="cursor-pointer"
                />
            </div>
        </HorizontalStack>
    )
}
