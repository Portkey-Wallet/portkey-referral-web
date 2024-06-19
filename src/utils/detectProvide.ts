import detectProvider from '@portkey/detect-provider';
import { IPortkeyProvider } from '@portkey/provider-types';

class DetectProvider {
  private provider: IPortkeyProvider | null | undefined;
  private initialized: boolean = false;
  constructor(){
    this.init().then(() => {
      this.initialized = true;
    }).catch((error) => {
      console.error("Error initializing provider:", error);
    });
  }
  async init() {
     this.provider = await detectProvider({
      providerName: 'Portkey',
    });
  }
  async share(config: {url?: string, title?: string, message?: string}) {
    const {url, title, message} = config;
    if(!this.initialized){
      console.warn('provider is not initialized, Please try again later!');
    }
    const result = await this.provider?.request({ method: 'Share', payload: {
      url,
      title,
      message,
    } });
    return result;
  }
}
const detectProviderInstance = new DetectProvider();
export default detectProviderInstance;
