import React, { useCallback, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import BaseImage from '@/components/BaseImage';
import Image from 'next/image';
import { referralTaskHeaderBg } from '@/assets/images';
import useResponsive from '@/hooks/useResponsive';
import { IActivityConfig } from '@/types/referral';

interface ReferralTaskProps {
  activityConfig: IActivityConfig;
}

const ReferralTask: React.FC<ReferralTaskProps> = ({ activityConfig }) => {
  const { taskImageUrl, pcTaskImageUrl } = activityConfig;
  const { isLG } = useResponsive();

  const imageUrl = useMemo(() => (isLG ? taskImageUrl : pcTaskImageUrl), [isLG, taskImageUrl, pcTaskImageUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.header_wrap}>
        <BaseImage className={styles.header_bg} src={referralTaskHeaderBg} priority alt="referral task" />
        <div className={styles.header_title}>Referral Task</div>
      </div>
      <Image
        className={isLG ? styles.task_image_h5 : styles.task_image_pc}
        width={isLG ? 311 : 552}
        height={isLG ? 300 : 236}
        src={imageUrl}
        alt="referral task"
      />
    </div>
  );
};

export default ReferralTask;
