import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import styles from './styles.module.css';

export default function CommonImage({
  className,
  innerClassName,
  alt = 'img',
  ...props
}: ImageProps & { innerClassName?: string }) {
  return (
    <div className={clsx(styles['common-img'], className)}>
      <Image {...props} alt={alt} className={innerClassName} />
    </div>
  );
}
