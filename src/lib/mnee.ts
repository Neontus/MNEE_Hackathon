import Mnee from '@mnee/ts-sdk';

const environment = (process.env.NEXT_PUBLIC_MNEE_ENV as 'production' | 'sandbox') || 'sandbox';
const apiKey = process.env.MNEE_API_KEY || undefined;

export const mnee = new Mnee({
  environment,
  apiKey,
});

export * from '@mnee/ts-sdk';
