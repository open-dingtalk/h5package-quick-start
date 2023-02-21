/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { WifiOutlined, CloseCircleOutlined } from '@ant-design/icons';
import getNetworkType from 'dingtalk-jsapi/api/device/connection/getNetworkType';
import { ready as ddReady } from 'dingtalk-jsapi/core';

declare let self: any;

interface INetworkIconProp {
  isConnected: boolean;
}

const NetworkTypeTextEnums = {
  '2G': '2G',
  '3G': '3G',
  '4G': '4G',
  '5G': '5G',
  WIFI: 'WIFI',
  NETREACHABLE: '不可用',
};

const convertNetworkType = (type: string) => {
  let nt: string;
  switch (type) {
    case '2g':
    case '3g':
    case '4g':
    case 'wifi':
    case 'unknown': {
      nt = type.toUpperCase();
      break;
    }
    case 'none':
    default: {
      nt = 'NETREACHABLE';
      break;
    }
  }
  return nt;
};

function NetworkIcon(props: INetworkIconProp) {
  const { isConnected } = props;
  return (
    <div className="flex h-full w-[25px]">
      {isConnected ? (
        <WifiOutlined style={{ color: 'Chartreuse', alignSelf: 'center' }} />
      ) : (
        <CloseCircleOutlined style={{ alignSelf: 'center' }} />
      )}
    </div>
  );
}

export function Network() {
  const [isConnected, setConnectedStatus] = useState(false);
  const [networkType, setNetworkType] = useState(NetworkTypeTextEnums.NETREACHABLE);

  useEffect(() => {
    ddReady(() => {
      document.addEventListener('resume', () => {
        updateNetworkData();
      });
      window.addEventListener('online', () => {
        setConnectedStatus(true);
      });
      window.addEventListener('offline', () => {
        setConnectedStatus(false);
      });
    });
    updateNetworkData();
  });

  const updateNetworkData = async () => {
    try {
      const res = await getNetworkType({});
      const type = NetworkTypeTextEnums[convertNetworkType(res.result)];
      setNetworkType(type);
      if (type !== NetworkTypeTextEnums.NETREACHABLE) {
        setConnectedStatus(true);
      } else {
        setConnectedStatus(false);
      }
    } catch (err) {
      console.log('failed to get network Info', err);
    }
  };

  useEffect(() => {
    self.networkData = {
      isConnected,
      networkType,
    };
  }, [isConnected, networkType]);

  return (
    <div className="flex justify-between">
      <div className="flex flex-row justify-center">
        网络联通性:
        <NetworkIcon isConnected={isConnected} />
      </div>
      <div>网络类型:{networkType}</div>
    </div>
  );
}
