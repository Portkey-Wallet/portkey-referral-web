import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import styles from './styles.module.css';

export default function CommonImage({ className, alt = 'img', ...props }: ImageProps) {
  return (
    <div className={clsx(styles['common-img'], className)}>
      <Image {...props} alt={alt} />
    </div>
  );
}