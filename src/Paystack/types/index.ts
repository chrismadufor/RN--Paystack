import * as React from 'react';
export type Currency = 'NGN' | 'GHS' | 'USD' | 'ZAR';

export type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';

interface Response {
  status: string;
}
interface SuccessResponse extends Response {
  transactionRef?: string;
  data?: any;
}

export interface PayStackProps {
  paystackKey: string;
  billingEmail: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string | number;
  amount?: string | number;
  currency?: Currency;
  channels?: PaymentChannels[];
  refNumber?: any;
  billingName?: string;
  handleWebViewMessage?: (string: string) => void;
  onCancel: (Response: Response) => void;
  onSuccess: (SuccessResponse:SuccessResponse) => void;
  autoStart?: boolean;
  activityIndicatorColor?: string;
  ref: React.ReactElement;
  metadata?: any;
  scope?: string;
  type?: string;
  plan_id?: string;
  coupon_code?: string;
  years?: number;
  description?: string;
  transData?: any;
}

export interface PayStackRef {
  startTransaction: () => void;
  endTransaction: () => void;
}