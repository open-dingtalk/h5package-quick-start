/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { List, Card } from 'antd';
import { DeleteOutlined, PlayCircleOutlined, PauseOutlined } from '@ant-design/icons';
import ddStartRecord from 'dingtalk-jsapi/api/device/audio/startRecord';
import ddStopRecord from 'dingtalk-jsapi/api/device/audio/stopRecord';
import audioPlay from 'dingtalk-jsapi/api/device/audio/play';
import audioStop from 'dingtalk-jsapi/api/device/audio/stop';
import alert from 'dingtalk-jsapi/api/device/notification/alert';
import getStorage from 'dingtalk-jsapi/api/util/domainStorage/getItem';
import setStorage from 'dingtalk-jsapi/api/util/domainStorage/setItem';
import downloadAudio from 'dingtalk-jsapi/api/device/audio/download';
import { DTButton, Network } from '../../utils/util';

const STORAGE_KEY_AUDIO = '__$$audio_audio';
declare const self: any;

interface IRHeaderProps {
  stopRecord: () => void;
}

interface IAudioProps {
  audioFilesList: any[];
  playAudio: (index: number) => void;
  stopAudio: (index: number) => void;
  removeAudio: (index: number) => {};
}

interface IAudioItem {
  state: string;
  localAudioId: string;
  gmtCreate: string;
  duration: number;
}

interface IAudioStopRes {
  localAudioId: string;
}

function RecordingHeader(props: IRHeaderProps) {
  return (
    <>
      <div>
        <div className="py-8[px]">
          <div className="relative top-0 left-[46%]">
            <div className="w-[12px] h-[12px] rounded-[12px] animate-loaderl absolute top-0 left-[-25px]" />
            <div className="w-[12px] h-[12px] rounded-[12px] animate-loaderm relative " />
            <div className="w-[12px] h-[12px] rounded-[12px] animate-loaderr absolute top-0 left-[25px]" />
          </div>
        </div>
      </div>
      <DTButton content="结束录音" onClick={props.stopRecord} />
    </>
  );
}

function AudioList(props: IAudioProps) {
  const { audioFilesList } = props;
  const onPlay = (index: number) => {
    props.playAudio(index);
  };

  const onPause = (index: number) => {
    props.stopAudio(index);
  };

  const onDelete = (index: number) => {
    props.removeAudio(index);
  };

  return (
    <>
      <div className="text-gray-600">本地音频文件列表（点击播放，停止，删除）</div>
      <List
        itemLayout="horizontal"
        dataSource={audioFilesList}
        renderItem={(item: IAudioItem, index) => (
          <List.Item style={{ padding: '12px 2px' }} key={item.gmtCreate}>
            <Card
              className="w-full"
              actions={[
                <PlayCircleOutlined key="play" onClick={(e) => onPlay(index)} />,
                <PauseOutlined key="pause" onClick={(e) => onPause(index)} />,
                <DeleteOutlined key="delete" onClick={(e) => onDelete(index)} />,
              ]}
            >
              {item.gmtCreate}
            </Card>
          </List.Item>
        )}
        rowKey={(item) => item.gmtCreate}
      />
    </>
  );
}

export default function AudioManager() {
  const [recordState, setRecordState] = useState('');
  const [fileList, setFileList] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(-1);
  const currentAudioRef = useRef();

  useEffect(() => {
    getStorage({ name: STORAGE_KEY_AUDIO }).then((audioCache: any) => {
      if (audioCache.value) {
        try {
          const audioCacheData = JSON.parse(audioCache.value);
          setFileList(
            audioCacheData.map((x: IAudioItem) => {
              return {
                ...x,
                state: 'init',
              };
            }),
          );
        } catch (e) {
          console.log('failed to parse audio cache data:', e);
        }
      }
    });

    return () => {
      const stopPlayingAudio = async () => {
        const item: IAudioItem = currentAudioRef.current;
        if (item?.localAudioId) {
          await audioStop({
            localAudioId: item.localAudioId,
            onSuccess: () => {
              setCurrentAudioIndex(-1);
            },
            onFail: (err: any) => {
              console.log('audio stop failed:', err);
            },
          });
        }
      };
      try {
        stopPlayingAudio();
      } catch (e) {
        console.log('failed to stop playing audio:', e);
      }
    };
  }, []);

  useEffect(() => {
    currentAudioRef.current = fileList[currentAudioIndex];
  }, [currentAudioIndex]);

  /** 录音转音频 start */
  const startRecord = () => {
    ddStartRecord({
      duration: 60,
      onSuccess: () => {
        updateRecordData({ state: 'recording' });
      },
      onFail: (err) => {
        alert({
          message: JSON.stringify(err),
          title: '录音失败',
        });
        updateRecordData({ state: 'done' });
      },
    });
  };

  const stopRecord = async () => {
    const network = self.networkData;
    if (!network.isConnected) {
      updateRecordData({ state: 'done' });
      alert({
        message: '当前网络不可用，无法录音',
        title: '提示',
        buttonName: '确定',
      });
      return;
    }
    try {
      await ddStopRecord({
        onSuccess: (res: IAudioStopRes) => {
          updateRecordData({ state: 'done' });
          addAudio(res);
        },
        onFail: (err: any) => {
          console.log('INFO:stopRecord failed:', err);
          updateRecordData({ state: 'done' });
        },
      });
    } catch (e) {
      console.log('failed to stop record, may beacause of network:', e);
    }
  };

  const updateRecordData = (nextData) => {
    setRecordState(nextData.state);
  };

  /** 录音转音频 end */

  const addAudio = (audioMeta) => {
    const newItem = {
      state: 'init',
      localAudioId: audioMeta.mediaId,
      gmtCreate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      duration: audioMeta.duration,
    };
    setFileList([newItem, ...fileList]);
    setStorage({
      name: STORAGE_KEY_AUDIO,
      value: JSON.stringify([
        newItem,
        ...fileList.map((x) => {
          return {
            ...x,
            state: 'init',
          };
        }),
      ]),
    });
  };

  const removeAudio = async (index) => {
    const newList = [...fileList];
    const item = newList[index];

    if (item.state === 'play') {
      await audioStop({
        localAudioId: item.localAudioId,
        onSuccess: () => {
          setCurrentAudioIndex(-1);
        },
        onFail: (err: any) => {
          console.log('audio stop failed:', err);
        },
      });
    }

    newList.splice(index, 1);
    setFileList(newList);

    setStorage({
      name: STORAGE_KEY_AUDIO,
      value: JSON.stringify(newList),
    });
  };

  const stopAudio = (index) => {
    const item = fileList[index];
    if (index > -1 && item && item.localAudioId) {
      audioStop({
        localAudioId: item.localAudioId,
        onSuccess: () => {
          console.log('stop success');
          updateAudioState(index, 'init');
          setCurrentAudioIndex(-1);
        },
        onFail: (err) => {
          console.log('stop failed:', err);
        },
      });
    }
  };

  const playAudio = async (index) => {
    if (currentAudioIndex > -1) {
      updateAudioState(currentAudioIndex, 'init');
    }
    const item = fileList[index];
    try {
      // download之后才能play
      const downloadRes = await downloadAudio({ mediaId: item.localAudioId });
      const res = await audioPlay({ localAudioId: item.localAudioId });
      updateAudioState(index, 'play');
      setCurrentAudioIndex(index);
    } catch (e) {
      console.log('audio play failed:', e);
    }
  };

  const updateAudioState = (index, state) => {
    if (index !== -1) {
      const newList = fileList;
      const newItem = {
        ...fileList[index],
        state,
      };
      newList.splice(index, 1, newItem);
      setFileList(newList);
    }
  };

  return (
    <div className="flex flex-col">
      <Network />
      <div>
        {recordState !== 'recording' && <DTButton content="开始录音" onClick={startRecord} />}
        {recordState === 'recording' && <RecordingHeader stopRecord={stopRecord} />}
      </div>
      <AudioList
        audioFilesList={fileList}
        removeAudio={removeAudio}
        stopAudio={stopAudio}
        playAudio={playAudio}
      />
    </div>
  );
}
