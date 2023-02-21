import { useEffect, useState, useRef } from 'react';
import { Image, Button } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { Notice, DTButton, Network } from '../../utils/util';
import getStorage from 'dingtalk-jsapi/api/util/domainStorage/getItem';
import setStorage from 'dingtalk-jsapi/api/util/domainStorage/setItem';
import alert from 'dingtalk-jsapi/api/device/notification/alert';
import chooseImage from 'dingtalk-jsapi/api/biz/util/chooseImage';
import confirm from 'dingtalk-jsapi/api/device/notification/confirm';

const offlineImageNote = '通过storage,缓存用户的图片数据，等网络通畅后再上传。';
const imageButton = '选择图片';
const STORAGE_KEY_IMAGE = '__$$images';

declare const self: any;
interface IImageItemProps {
  status: string;
  url: string;
  index: number;
  doUpload: (index: number) => void;
  doRemove: (index: number) => void;
  onImageLoadFail: (index: number) => void;
}

interface IGStorageParam {
  value: string;
}

interface IConfirmRes {
  buttonIndex?: number;
}

interface IChooseImageRes {
  filePaths?: string[];
  path?: string;
  size?: number;
  fileType?: string;
}

const UploadStatusEnums = {
  Wait: 'Wait',
  Progress: 'Progress',
  Fail: 'Fail',
  Success: 'Success',
  Invalid: 'Invalid',
};

function ImageItem(props: IImageItemProps) {
  const { status, url, index } = props;
  const doUpload = () => {
    props.doUpload(index);
  };
  const doRemove = () => {
    props.doRemove(index);
  };
  const showImage = (
    <Image
      width={100}
      height={100}
      src={url}
      className="pr-3"
      onError={() => {
        props.onImageLoadFail(index);
      }}
    />
  );
  if (status === UploadStatusEnums.Wait) {
    return (
      <div className="flex flex-row items-center justify-between my-3 pb-[12px] border-b border-gry-600">
        <div className="flex flex-row items-center my-3 pb-[12px]">
          {showImage}
          <div>等待上传</div>
        </div>
        <Button className="text-sm px-[5px]" size="small" onClick={doUpload}>
          上传
        </Button>
      </div>
    );
  } else if (status === UploadStatusEnums.Success) {
    return (
      <div className="flex flex-row items-center my-3 pb-[12px] border-b border-gry-600">
        {showImage}
        <CheckCircleOutlined style={{ color: 'green' }} />
        <div style={{ marginLeft: '8px' }}>上传成功</div>
      </div>
    );
  } else if (status === UploadStatusEnums.Invalid) {
    return (
      <div className="flex flex-row items-center justify-between my-3 pb-[12px] border-b border-gry-600">
        <div className="flex flex-row items-center my-3 pb-[12px]">
          {showImage}
          <span>已失效</span>
        </div>
        <Button className="text-sm px-[5px]" size="small" onClick={doRemove}>
          移除
        </Button>
      </div>
    );
  } else if (status === UploadStatusEnums.Progress) {
    return (
      <div className="flex flex-row items-center my-3 pb-[12px] border-b border-gry-600">
        {showImage}
        <div style={{ marginRight: '8px' }}>上传中</div>
        <LoadingOutlined />
      </div>
    );
  } else if (status === UploadStatusEnums.Fail) {
    return (
      <div className="flex flex-row items-center justify-between my-3 pb-[12px] border-b border-gry-600">
        <div className="flex flex-row items-center my-3 pb-[12px]">
          {showImage}
          <IssuesCloseOutlined style={{ color: 'red' }} />
          <div style={{ marginLeft: '8px' }}>上传失败</div>
        </div>
        <Button className="text-sm px-[5px]" size="small" onClick={doUpload}>
          重试
        </Button>
      </div>
    );
  }
}

export default function ImageComponent() {
  const [images, setImages] = useState([]);
  const imagesRef = useRef();

  useEffect(() => {
    getStorage({ name: STORAGE_KEY_IMAGE }).then(
      (data: IGStorageParam) => {
        try {
          const storageImages = JSON.parse(data.value) || [];
          if (storageImages.length > 0) {
            setImages(storageImages);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`failed to parse ${data.value} because `, err);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      },
    );
    return updateStorage;
  }, []);

  useEffect(() => {
    (imagesRef as any).current = images;
  }, [images]);

  const updateStorage = () => {
    setStorage({
      name: STORAGE_KEY_IMAGE,
      value: JSON.stringify(imagesRef.current),
    });
  };

  const chooseImageInAlbum = async () => {
    const res: IChooseImageRes = await chooseImage({ count: 9 });
    if (!Array.isArray(res.filePaths)) {
      return;
    }
    setImages([
      ...images,
      ...res.filePaths.map((f) => ({
        url: f,
        status: UploadStatusEnums.Wait,
      })),
    ]);
  };

  const doUpload = async (index: number) => {
    const network = self.networkData;
    if (!network.isConnected) {
      alert({
        message: '当前网络不可用，无法上传',
        title: '提示',
        buttonName: '确定',
      });
      return;
    }
    if (!(network.networkType === 'WIFI')) {
      const c: IConfirmRes = await confirm({
        title: '上传确认',
        message: '您当前不是WIFI环境，上传可能会消耗运行商流量，是否确定上传？',
        buttonLabels: ['我确定上传', '我再等等'],
      });

      if (c.buttonIndex !== 0) {
        return;
      }
    }

    images.splice(index, 1, {
      url: images[index].url,
      status: UploadStatusEnums.Progress,
    });
    setImages([...images]);

    setTimeout(() => {
      images.splice(index, 1, {
        url: images[index].url,
        status: UploadStatusEnums.Success,
      });
      setImages([...images]);
    }, 5000);
  };

  const doRemove = (index) => {
    if (images && images[index]) {
      images.splice(index, 1);
      setImages([...images]);
    }
  };

  const onImageLoadFail = (index: number) => {
    if (images && images[index]) {
      const validItem = {
        url: images[index].url,
        status: UploadStatusEnums.Invalid,
      };
      images.splice(index, 1, validItem);
      setImages([...images]);
    }
  };

  return (
    <div>
      <Notice note={offlineImageNote} />
      <Network />
      <DTButton content={imageButton} onClick={chooseImageInAlbum} />
      <div>
        {images.map((item, index) => (
          <ImageItem
            url={item.url}
            status={item.status}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            onImageLoadFail={onImageLoadFail}
            doRemove={doRemove}
            doUpload={doUpload}
          />
        ))}
      </div>
    </div>
  );
}
