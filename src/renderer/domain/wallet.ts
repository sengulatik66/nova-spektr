import { Contact } from './contact';
import { Account, ChainAccount } from './account';
import { CryptoType } from './shared-kernel';

export type SimpleWallet = {
  name: string;
  mainAccounts: Account[];
  chainAccounts: ChainAccount[];
  isMultisig: boolean;
  isActive: boolean;
  type: WalletType;
};

export type MultisigWallet = SimpleWallet & {
  threshold: number;
  originContacts: Contact[];
  messengerRoomId: string;
};

export type Wallet = MultisigWallet;

export const enum WalletType {
  WATCH_ONLY,
  PARITY,
  LEDGER,
}

export function isMultisig(wallet?: Wallet): boolean {
  return Boolean(wallet?.isMultisig);
}

export function createSimpleWallet<T extends SimpleWallet>({
  name,
  type,
  mainAccounts,
  chainAccounts,
}: Omit<T, 'isMultisig' | 'isActive'>): Wallet {
  return {
    name,
    type,
    mainAccounts,
    chainAccounts,
    isMultisig: false,
    isActive: false,
    threshold: 0,
    messengerRoomId: '',
    originContacts: [],
  };
}

export function createMultisigWallet<T extends MultisigWallet>({
  name,
  type,
  mainAccounts,
  chainAccounts,
  threshold,
  originContacts,
  messengerRoomId,
}: Omit<T, 'isMultisig' | 'isActive'>): Wallet {
  return {
    name,
    type,
    mainAccounts,
    chainAccounts,
    isMultisig: true,
    isActive: false,
    threshold,
    originContacts,
    messengerRoomId,
  };
}
export function createMainAccount({ accountId, publicKey }: Omit<Account, 'cryptoType'>): Account {
  return {
    accountId,
    publicKey,
    cryptoType: CryptoType.ED25519,
  } as Account;
}