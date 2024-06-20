import React, { useMemo } from 'react';
import { ConfigProvider, Modal as AntdModal } from 'antd';
import styles from './index.module.scss';
import { close } from '@/assets/images';
import Image from 'next/image';
import useResponsive from '@/hooks/useResponsive';
import { Popup } from 'antd-mobile';

export interface ModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  children: React.ReactNode;
}
function CommonModal(props: ModalProps) {
  const { children, title, open: isOpen, onCancel } = props;

  const { isLG } = useResponsive();

  const webDom = useMemo(() => {
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
          width={440}
          footer={null}
          centered
          {...props}
          className={styles.modal_web}
          wrapClassName={`${styles['modal-wrap']}`}
          title={
            <div className={styles.titleWrap}>
              <div className={styles.titleText}>{title}</div>
            </div>
          }>
          {children}
        </AntdModal>
      </ConfigProvider>
    );
  }, [children, props, title]);

  const mobileDom = useMemo(() => {
    return (
      <Popup
        visible={isOpen}
        onMaskClick={onCancel}
        onClose={onCancel}
        bodyStyle={{
          height: '80vh',
          backgroundColor: '#161630',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          overflow: 'hidden',
        }}>
        <div className={styles.headerWrap} onClick={onCancel}>
          <div className={styles.titleWrap}>
            <div className={styles.titleText}>{title}</div>
          </div>
          <Image className={styles.closeImage} src={close} width={20} height={20} alt="close" />
        </div>
        {children}
      </Popup>
    );
  }, [children, isOpen, onCancel, title]);

  return isLG ? mobileDom : webDom;
}

export default React.memo(CommonModal);
