import clsx from 'clsx';
import NetworkSVG from '../SVGComponents/NetworkSVG';
import PaperAirplaneSVG from '../SVGComponents/PaperAirplaneSVG';
import styles from './styles.module.scss';

type TOpenInBrowserTypes = {
  isWeChat?: boolean;
};

export default function OpenInBrowser(props: TOpenInBrowserTypes) {
  const { isWeChat = true } = props;

  if (!isWeChat) return <div className={styles.maskContainer} />;
  return (
    <div className={styles.maskContainer}>
      <div className={styles.paperAirplane}>
        <NetworkSVG />
      </div>

      <div className={clsx(['flex-row-center', 'justify-end', styles.tipWrap])}>
        <PaperAirplaneSVG />
        <div className={styles.text}>
          {`Click "..." on the upper right corner and select `}
          <span className={styles.hightLight}>{`"Open in Browser"`}</span>
        </div>
      </div>
    </div>
  );
}
