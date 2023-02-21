import { useState } from 'react';
import { Input, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Network } from '../../utils/util';
import getStorage from 'dingtalk-jsapi/api/util/domainStorage/getItem';
import setStorage from 'dingtalk-jsapi/api/util/domainStorage/setItem';
import removeStorage from 'dingtalk-jsapi/api/util/domainStorage/removeItem';
import alert from 'dingtalk-jsapi/api/device/notification/alert';

export default function Storage() {
  const [key, setKey] = useState();
  const [data, setData] = useState();

  const onKeyChange = (e) => {
    setKey(e.target.value);
  };

  const onDataChange = (e) => {
    setData(e.target.value);
  };

  const onSetStorage = async () => {
    if (key && data) {
      await setStorage({
        name: key,
        value: data,
      });
      alert({
        message: `key:${key}--value:${data}`,
        title: '存储成功',
      });
    }
  };
  const onGetStorage = async () => {
    if ((key as any).length === 0) {
      alert({
        message: 'key 不能为空',
        title: '读取数据失败',
      });
    }
    const res: any = await getStorage({ name: key });

    alert({
      message: `key:${key}--value:${res.value}`,
      title: '读取缓存数据成功',
    });
  };

  const onRemoveStorage = () => {
    if (key) {
      removeStorage({
        name: key,
      });
    }
  };

  return (
    <>
      <Network />
      <div className="flex my-[8px]">
        <div className="text-center w-[15%]">key:</div>
        <Input
          placeholder="Enter key"
          suffix={
            <Tooltip title="Extra information">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
          onChange={onKeyChange}
        />
      </div>
      <div className="flex my-[8px]">
        <div className="text-center w-[15%]">data:</div>
        <Input
          placeholder="Enter data"
          suffix={
            <Tooltip title="Extra information">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
          onChange={onDataChange}
        />
      </div>
      <div className="my-[8px]">调用方法：</div>
      <Button onClick={onSetStorage}>存储数据</Button>
      <Button onClick={onGetStorage}>读取数据</Button>
      <Button onClick={onRemoveStorage}>删除数据</Button>
    </>
  );
}
