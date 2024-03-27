// Azure authentication dependency
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity';

import {BlobServiceClient} from "@azure/storage-blob"

export default function Test() {
  const account = "acvdpwu2t003st";
  const containerName = "testcontainer"
const tenantId = process.env["AZURE_AD_TENANT_ID"];
const clientId = process.env["AZURE_AD_CLIENT_ID"];
const secret = process.env["AZURE_AD_CLIENT_SECRET"];
let credentials: any = null
// Acquire credential
if (tenantId && clientId && secret){
    console.log(tenantId, clientId, secret)
    credentials = new ClientSecretCredential(tenantId, clientId, secret);
}else{
    console.log('wrong')
    credentials = new DefaultAzureCredential();
}
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  credentials
);

async function listBlob() {
  async function streamToBuffer(readableStream: any) {
    return new Promise((resolve, reject) => {
      const chunks: any = [];
      readableStream.on("data", (data: any) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
  const containerClient = blobServiceClient.getContainerClient(containerName)
  let i = 1;
  let blobs = containerClient.listBlobsFlat()
  for await (const blob of blobs) {
    // const downloadBlockBlobResponse: any = await blobClient.download();
    // const downloaded = (
    //   await streamToBuffer(downloadBlockBlobResponse.readableStreamBody) as any
    // ).toString();
    
    // console.log("Downloaded blob content:", downloaded);
    console.log(`Container ${i++}: ${blob.name}`);
  }
}

async function main() {
  let i = 1;
  let containers = blobServiceClient.listContainers();
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`);
  }
}
listBlob()

// async function listSubscriptions() {
//   try {

//     // use credential to authenticate with Azure SDKs
//     const client = new SubscriptionClient(credentials);

//     console.log(client)
//     // get details of each subscription
//     for await (const item of client.subscriptions.list()) {
//         console.log('item: ', item)
//       const subscriptionDetails = await client.subscriptions.get(
//         item.subscriptionId || ''
//       );
//       console.log('LOG: ', subscriptionDetails);
//     }
//   } catch (err) {
//     console.error(JSON.stringify(err));
//   }
// }

// listSubscriptions()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((ex) => {
//     console.log(ex);
//   });
  return <div>test</div>
}

