import { Link } from 'react-router-dom';
import { Card, Avatar } from 'antd';
import getInfo from 'dingtalk-jsapi/api/biz/resource/getInfo';
import { useState, useEffect } from 'react';

/** Introduction */
const mockMetaData = [
  {
    avaSrc:
      'https://gw.alicdn.com/imgextra/i3/O1CN01DPH5dC1YREmlu7TSr_!!6000000003055-2-tps-77-64.png',
    title: '拍照、相册',
    description: '离线缓存图片数据后再上传',
  },
  {
    avaSrc:
      'https://img.alicdn.com/imgextra/i1/O1CN01hdklLf1QAjaTDq7Rw_!!6000000001936-2-tps-256-256.png',
    title: '二维码',
    description: '离线存储扫码结果',
  },
  {
    avaSrc:
      'https://img.alicdn.com/imgextra/i3/O1CN013V4qgw1R8H4puXEaB_!!6000000002066-2-tps-256-256.png',
    title: '本地缓存',
    description: '离线缓存草稿，网络通畅后上传',
  },
  {
    avaSrc:
      'https://img.alicdn.com/imgextra/i4/O1CN01XoTchJ1KXHOG5OLJp_!!6000000001173-2-tps-64-64.png',
    title: '表单',
    description: '离线缓存本地表单数据',
  },
  {
    avaSrc:
      'https://img.alicdn.com/imgextra/i2/O1CN01kErOdR1RfhzQikEPe_!!6000000002139-2-tps-64-64.png',
    title: '录音',
    description: '离线缓存本地录音音频数据',
  },
];

const { Meta } = Card;

interface IItemProps {
  title: string;
  description: string;
  avaSrc: string;
}

const OffLineInfo = () => {
  const [content, setContent] = useState('离线包未开启');
  useEffect(() => {
    getInfo({}).then((res) => {
      const { status } = res;
      if (status === 'enable') {
        // 提示离线包内容
        setContent('离线包已开启');
      }
    });
  }, []);
  return <div className="flex justify-center mb-4 text-gray-600">当前环境:{content}</div>;
};

const Item = (props: { metaData: IItemProps }) => {
  const { title, description, avaSrc } = props.metaData;
  return (
    <Card>
      <Meta avatar={<Avatar src={avaSrc} />} title={title} description={description} />
    </Card>
  );
};

function Navbar() {
  return (
    <div>
      <OffLineInfo />
      <Link to="/image">
        <Item metaData={mockMetaData[0]} />
      </Link>
      <Link to="/form">
        <Item metaData={mockMetaData[3]} />
      </Link>
      <Link to="/scan-code">
        <Item metaData={mockMetaData[1]} />
      </Link>
      <Link to="/storage">
        <Item metaData={mockMetaData[2]} />
      </Link>
      <Link to="/audio">
        <Item metaData={mockMetaData[4]} />
      </Link>
    </div>
  );
}

export default Navbar;
