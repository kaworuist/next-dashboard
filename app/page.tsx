import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

export default async function Page() {

  const account = "acvdpwu2t003st";
  const containerName = "testcontainer"
const tenantId = process.env["AZURE_AD_TENANT_ID"];
const clientId = process.env["AZURE_AD_CLIENT_ID"];
const secret = process.env["AZURE_AD_CLIENT_SECRET"];
let credentials: any = null
const arrList: any = []
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

// async function listBlob() {
//   async function streamToBuffer(readableStream: any) {
//     return new Promise((resolve, reject) => {
//       const chunks: any = [];
//       readableStream.on("data", (data: any) => {
//         chunks.push(data instanceof Buffer ? data : Buffer.from(data));
//       });
//       readableStream.on("end", () => {
//         resolve(Buffer.concat(chunks));
//       });
//       readableStream.on("error", reject);
//     });
//   }
//   const containerClient = blobServiceClient.getContainerClient(containerName)
//   let i = 1;
//   let blobs = containerClient.listBlobsFlat()
//   for await (const blob of blobs) {
//     // const downloadBlockBlobResponse: any = await blobClient.download();
//     // const downloaded = (
//     //   await streamToBuffer(downloadBlockBlobResponse.readableStreamBody) as any
//     // ).toString();
    
//     // console.log("Downloaded blob content:", downloaded);
//     console.log(`Container ${i++}: ${blob.name}`);
//   }
// }

async function main() {
  let i = 1;
  let containers = blobServiceClient.listContainers();
  for await (const container of containers) {
    arrList.push(container.name)
    console.log(`Container ${i++}: ${container.name}`);
  }
}
await main()

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
        <div
          className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent"
        />
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal ${lusitana.className}`}>
            <strong>Welcome to Acme.</strong>
            {
              arrList.map((item: any) => <div key={item}>{item}</div>)
            }
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image src='/hero-desktop.png' width={1000} height={760} className='hidden md:block' alt='Screenshots of the dashboard project showing desktop version'></Image>
          <Image
        src="/hero-mobile.png"
        width={560}
        height={620}
        className="block md:hidden"
        alt="Screenshot of the dashboard project showing mobile version"
      />
        </div>
      </div>
    </main>
  );
}
