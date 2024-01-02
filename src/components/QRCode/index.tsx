import { QRCode, IProps } from 'react-qrcode-logo';
import { QRCodeLogo } from '@/assets/images';

interface IQRCode extends IProps {
  value: string;
  className?: string;
  size?: number;
  quietZone?: number;
}

export default function QRCodeCommon({ value, size, quietZone, ...props }: IQRCode) {
  return (
    <QRCode
      value={value}
      size={size || 200}
      quietZone={quietZone || 10}
      logoImage={QRCodeLogo.src}
      logoWidth={24}
      logoHeight={24}
      qrStyle="squares"
      eyeRadius={{ outer: 7, inner: 4 }}
      ecLevel="L"
      {...props}
    />
  );
}
