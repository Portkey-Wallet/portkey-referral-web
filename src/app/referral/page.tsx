'use client';
import dynamic from 'next/dynamic';


export default dynamic(() => import('../../pageComponents/ReferralPage'), { ssr: false });
// export default Referral;
