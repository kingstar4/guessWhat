export type CategoryItemProps = {
    img: any;
    text: string;
    onPress?: () => void;
};

export type WordItem = { 
    id: number | string, 
    term: string, 
    tabooWords: string[]
};

export type WordDB = {
    version: number, 
    last_updated?: string; 
    [category:string]:any
};

export type UseWordBankOptions = {
  remoteUrl?: string;
  autoSync?: boolean;
  mergeStrategy?: 'replace' | 'merge';
  onSync?: (changed: boolean) => void;
};