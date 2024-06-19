import React from 'react';
import { ConfigProvider, Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import styles from './index.module.scss';
import { close } from '@/assets/images';
import Image from 'next/image';
import useResponsive from '@/hooks/useResponsive';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
  width?: number;
  disableMobileLayout?: boolean;
}
function CommonModal(props: ModalProps) {
  const { children, className, title, subTitle, wrapClassName, width = 440, disableMobileLayout = false } = props;

  const { isLG } = useResponsive();

  const modalStyles = {
    header: {
      backgroundColor: '#161630',
    },
    content: {
      backgroundColor: '#161630',
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
  };
  return (
    <ConfigProvider
      modal={{
        styles: modalStyles,
      }}>
      <AntdModal
        keyboard={false}
        maskClosable={false}
        destroyOnClose={true}
        closeIcon={<Image src={close} width={20} height={20} alt="close" />}
        width={width}
        footer={null}
        centered
        {...props}
        className={styles.modal_web}
        wrapClassName={`${styles['modal-wrap']} ${wrapClassName}`}
        title={
          <div className={styles.titleWrap}>
            <div className={styles.titleText}>{title}</div>
          </div>
        }>
        {children}
      </AntdModal>
    </ConfigProvider>
  );
}

export default React.memo(CommonModal);
