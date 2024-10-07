import { Umi } from '@metaplex-foundation/umi';
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi';

export const uploadImage = async (umi: Umi, rpc: string, image: File) => {
  const file = await createGenericFileFromBrowserFile(image);
  let [url] = await umi.uploader.upload([file]);
  if (rpc.includes('devnet')) {
    url = url.replace('https://arweave.net/', 'https://gateway.irys.xyz/');
  }
  return url;
};
