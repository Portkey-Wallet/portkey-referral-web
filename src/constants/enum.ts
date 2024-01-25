export enum IMAGE_POSITION {
    Left,
    Right,
  }
  
  export enum DEVICE_TYPE {
    Android,
    IOS,
    WebChrome,
    WebNotChrome,
  }
  
  export enum NAV_TYPE {
    BLUE,
    WHITE,
  }
  
  export enum ROUTER {
    DEFAULT = '/',
    DOWNLOAD = '/download',
    TERMS_OF_SERVICE = '/terms-of-service',
    MEDIA_KIT = '/media-kit',
  }
  
  export enum NavigationType {
    NOT_JUMP = 1, // do not jump
    ROUTE = 2, // routing Jump
    OPEN_NEW_TAB = 3, // open the URL in a new tab
  }
  