import {
  Link
} from "@shopify/polaris";
import { useState } from 'react';
import { ImportProductImage } from './ImportProductImage'
import { ImportCollectionImage } from './ImportCollectionImage'

export function Import({ files, setFiles, setToastProps }) {

  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  return (
    <>
      <p style={{ textAlign: "center" }}>
        Or, add images from existing{' '}
        <Link monochrome onClick={() => setProductPickerOpen(true)}>
          products
        </Link>
        {' '}or{' '}
        <Link monochrome onClick={() => setCollectionPickerOpen(true)}>
          collections
        </Link>
        .
      </p>
      { productPickerOpen &&
        <ImportProductImage
          files={files}
          setFiles={setFiles}
          productPickerOpen={productPickerOpen}
          setProductPickerOpen={setProductPickerOpen}
        />
      }
      { collectionPickerOpen &&
        <ImportCollectionImage
          files={files}
          setFiles={setFiles}
          setCollectionPickerOpen={setCollectionPickerOpen}
          collectionPickerOpen={collectionPickerOpen}
        />
      }
    </>
  );
}
