import {
    HorizontalStack,
    Icon
} from "@shopify/polaris";
import {
    DeleteMajor,
    PageDownMajor
} from '@shopify/polaris-icons';

export const LightboxFooter = () => {
    return (
        <HorizontalStack>
            <div onClick={() => setImageIndex(imageIndex + 1)}>
                <Icon
                    source={DeleteMajor}
                    color="base"
                    classList="cursor-pointer"
                />
            </div>
            <div onClick={() => setImageIndex(imageIndex + 1)}>
                <Icon
                    source={PageDownMajor}
                    color="base"
                    classList="cursor-pointer"
                />
            </div>
        </HorizontalStack>
    )
}
