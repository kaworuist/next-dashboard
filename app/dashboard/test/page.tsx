// Azure authentication dependency
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity';

// Azure resource management dependency
import { SubscriptionClient } from "@azure/arm-subscriptions";

export default function Test() {

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


async function listSubscriptions() {
  try {

    // use credential to authenticate with Azure SDKs
    const client = new SubscriptionClient(credentials);

    console.log(client)
    // get details of each subscription
    for await (const item of client.subscriptions.list()) {
        console.log('item: ', item)
      const subscriptionDetails = await client.subscriptions.get(
        item.subscriptionId || ''
      );
      console.log('LOG: ', subscriptionDetails);
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
}

listSubscriptions()
  .then(() => {
    console.log("done");
  })
  .catch((ex) => {
    console.log(ex);
  });
  return <div>test</div>
}

