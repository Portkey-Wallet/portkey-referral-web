import { QRCode, IProps } from 'react-qrcode-logo';
import { QRCodeLogo } from '@/assets/images';

interface IQRCode extends IProps {
  value: string;
  className?: string;
  size?: number;
  quietZone?: number;
  ecLevel?: IProps['ecLevel'];
}

export default function QRCodeCommon({ value, size, quietZone, ecLevel, ...props }: IQRCode) {
  return (
    <QRCode
      value={value}
      size={size || 200}
      quietZone={quietZone || 10}
      logoImage={QRCodeLogo.src}
      logoWidth={24}
      logoHeight={24}
      qrStyle="squares"
      eyeRadius={{ outer: 4, inner: 1 }}
      ecLevel={ecLevel || 'M'}
      {...props}
    />
  );
}
