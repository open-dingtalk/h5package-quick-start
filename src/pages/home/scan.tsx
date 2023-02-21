import { useState } from 'react';
import { DTButton } from '../../utils/util';
import ddScan from 'dingtalk-jsapi/api/biz/util/scan';

const scanButton = '扫码';

interface IScanRes {
  text: string;
}

export default function ScanCode() {
  const [scanned, isScanned] = useState(false);
  const [codeRes, setCodeRes] = useState('无内容');
  const scan = () => {
    ddScan({
      onSuccess: (data: IScanRes) => {
        const res = data.text;
        setCodeRes(res);
        isScanned(true);
      },
    });
  };
  const res = scanned ? (
    <div>
      <div className="scan-text text-sm text-gray-700 my-[8px]">以下为扫码内容</div>
      <div className="scan-text text-sm text-gray-700 my-[8px">{codeRes}</div>
    </div>
  ) : (
    <></>
  );
  return (
    <>
      <DTButton content={scanButton} onClick={scan} />
      {res}
    </>
  );
}
