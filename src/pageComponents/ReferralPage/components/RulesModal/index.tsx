import React from 'react';
import styles from './styles.module.scss';
import CommonModal from '@/components/CommonModal';
import { useResponsive } from '@/hooks/useResponsive';

interface RulesModalProps {
  rulesText: string;
  open: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ rulesText, open, onClose }) => {
  const { isLG } = useResponsive();

  return (
    <CommonModal title={'Rules'} open={open} onCancel={onClose}>
      <div className={`${styles.container} ${isLG ? styles.padding_h5 : styles.padding_pc}`}>
        <div className={`${styles.rules_text} ${isLG ? styles.rules_text_top_h5 : styles.rules_text_top_pc}`}>
          {rulesText}
        </div>
      </div>
    </CommonModal>
  );
};

export default RulesModal;
