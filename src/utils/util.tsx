import { Button } from 'antd';

interface INoticeProps {
  note: string;
}

interface DTBProps {
  content: string;
  onClick: () => void;
}

export function Notice(props: INoticeProps) {
  return <div className="text-gray-600 text-sm">{props.note}</div>;
}

export function DTButton(props: DTBProps) {
  return (
    <Button className="my-[24px]" type="primary" onClick={props.onClick}>
      {props.content}
    </Button>
  );
}

declare let self: any;
self.networkData = {
  isConnected: false,
  networkType: '不可用',
};

export * from './network';
