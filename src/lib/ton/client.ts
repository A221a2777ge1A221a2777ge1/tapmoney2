// TON payout client scaffold. Swappable implementation behind a small interface.
// This uses dynamic import so the code won't crash if the TON SDK isn't installed yet.

export type TonPayoutResult = {
  toAddress: string;
  amount: number;
  comment?: string | null;
  txId?: string;
  status: 'sent' | 'queued' | 'skipped';
  error?: string;
};

export class TonPayoutClient {
  private endpoint: string | undefined;
  private apiKey: string | undefined;
  private enabled: boolean;

  constructor() {
    this.endpoint = process.env.TON_ENDPOINT;
    this.apiKey = process.env.TONCENTER_API_KEY;
    this.enabled = process.env.TONWEB_ENABLED === '1';
  }

  async send(toAddress: string, amount: number, comment?: string): Promise<TonPayoutResult> {
    if (!this.enabled) {
      return { toAddress, amount, comment, status: 'queued' };
    }

    // Attempt to load tonweb at runtime
    let TonWeb: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      TonWeb = (await import('tonweb')).default || (await import('tonweb'));
    } catch (e) {
      return { toAddress, amount, comment, status: 'skipped', error: 'TON SDK not installed (npm i tonweb)' };
    }

    try {
      const provider = new TonWeb.HttpProvider(this.endpoint || 'https://toncenter.com/api/v2/jsonRPC', {
        apiKey: this.apiKey,
      });
      const tonweb = new TonWeb(provider);

      // You must provide wallet credentials via env before enabling real sends.
      const secretKeyHex = process.env.TON_SECRET_KEY_HEX;
      const publicKeyHex = process.env.TON_PUBLIC_KEY_HEX;
      if (!secretKeyHex || !publicKeyHex) {
        return { toAddress, amount, comment, status: 'skipped', error: 'Wallet keys not configured' };
      }

      const keyPair = {
        publicKey: TonWeb.utils.hexToBytes(publicKeyHex),
        secretKey: TonWeb.utils.hexToBytes(secretKeyHex),
      };

      const WalletClass = tonweb.wallet.all.v4R2;
      const wallet = new WalletClass(provider, { publicKey: keyPair.publicKey });
      const walletAddress = await wallet.getAddress();

      // Get current seqno
      const seqno = await wallet.methods.seqno().call();

      // Create transfer
      const amountNano = TonWeb.utils.toNano(amount.toString());
      const transfer = wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress,
        amount: amountNano,
        seqno,
        payload: comment || '',
        sendMode: 3,
      });

      const result = await transfer.send();
      const txId = typeof result === 'string' ? result : undefined;
      return { toAddress, amount, comment, status: 'sent', txId };
    } catch (e: any) {
      return { toAddress, amount, comment, status: 'skipped', error: e?.message || 'Unknown TON error' };
    }
  }
}