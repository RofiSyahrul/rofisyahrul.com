interface UABrowser {
  name: string;
  version: string;
}

interface UADevice {
  model: string;
  type: string;
  vendor: string;
}

export interface UserAgent {
  browser: UABrowser;
  device: UADevice;
  isMobile: boolean;
}
