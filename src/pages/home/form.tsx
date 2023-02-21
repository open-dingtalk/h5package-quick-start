import { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Radio, DatePicker } from 'antd';
import { Network } from '../../utils/network';
import alert from 'dingtalk-jsapi/api/device/notification/alert';
import confirm from 'dingtalk-jsapi/api/device/notification/confirm';
import getStorage from 'dingtalk-jsapi/api/util/domainStorage/getItem';
import setStorage from 'dingtalk-jsapi/api/util/domainStorage/setItem';
import removeStorage from 'dingtalk-jsapi/api/util/domainStorage/removeItem';
import dayjs from 'dayjs';

const { TextArea } = Input;

const STORAGE_KEY = '__$$form';
const FORM_DRAFT_KEY = '__$$form_draft';
declare const self: any;

interface ISubmitParams {
  values?: any;
  msg?: string;
  clearForm?: Boolean;
  clearDraft?: Boolean;
}
interface IGStorageParam {
  value: string;
}

export default function StorageForm() {
  const [dirty, setDirty] = useState(false);
  const [draft, setDraft] = useState({});
  const [form] = Form.useForm();
  const formRef = useRef();
  const dirtyRef = useRef();

  // onReady
  useEffect(() => {
    getStorage({
      name: STORAGE_KEY,
    })
      .then((res: IGStorageParam) => {
        try {
          const prevFormCache = JSON.parse(res.value);
          if (prevFormCache) {
            confirm({
              title: '提示',
              message: '您有一份未完成的草稿，是否加载草稿内容？',
              buttonLabels: ['是', '否'],
            }).then((result) => {
              if (result.buttonIndex === 0) {
                form.setFieldsValue({
                  commitType: prevFormCache.commitType,
                  commitTime:
                    prevFormCache.commitTime === ''
                      ? prevFormCache.commitTime
                      : dayjs(prevFormCache.commitTime),
                  commitDetail: prevFormCache.commitDetail,
                });
                setDirty(true);
                removeStorage({ name: STORAGE_KEY });
              }
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('failed to parse previous draft:', e);
        }
      });

    getDraft().then((res) => {
      setStorageDraft(res, false);
    });

    return onUnload;
  }, []);

  const getDraft = () => {
    return new Promise((r, c) => {
      getStorage({
        name: FORM_DRAFT_KEY,
      })
        .then(
          (res: IGStorageParam) => {
            r(res.value);
          },
          (reason) => {
            c(reason);
          },
        );
    });
  };

  const setStorageDraft = async (pdraft, storage = true) => {
    let draftData = pdraft;
    if (typeof pdraft === 'string' && pdraft !== '') {
      draftData = JSON.parse(pdraft);
    }
    setDraft(draftData);
    // 存储数据
    if (storage) {
      setStorage({
        name: FORM_DRAFT_KEY,
        value: JSON.stringify(pdraft),
      });
    }
  };

  useEffect(() => {
    formRef.current = form.getFieldsValue();
  }, [form.getFieldsValue()]);

  useEffect(() => {
    (dirtyRef as any).current = dirty;
  }, [dirty]);

  useEffect(() => {
    if (draft) {
      form.setFieldsValue({
        commitType: (draft as any).commitType,
        commitTime: dayjs((draft as any).commitTime),
        commitDetail: (draft as any).commitDetail,
      });
    } else {
      form.setFieldsValue({
        commitType: '',
        commitTime: '',
        commitDetail: '',
      });
    }
  }, [draft]);

  const onUnload = () => {
    const { commitType, commitTime, commitDetail } = (formRef as any).current;
    const formData = { commitType, commitTime, commitDetail };
    if (dirtyRef.current) {
      setStorage({
        name: STORAGE_KEY,
        value: JSON.stringify(formData),
      });
    }
  };

  const doSubmit = (data: ISubmitParams) => {
    const { msg, clearForm, clearDraft } = data;
    return new Promise<void>((resolve) => {
      alert({
        title: '提示',
        message: msg || '表单提交成功',
      }).then(() => {
        if (clearForm) {
          setDirty(false);
          form.setFieldsValue({ commitType: '', commitTime: '', commitDetail: '' });
        }

        if (clearDraft) {
          setDraft(null);
          removeStorage({
            name: FORM_DRAFT_KEY,
          });
        }

        resolve();
      });
    });
  };
  const onFinish = () => {
    // 表单提交
    const { commitType, commitTime, commitDetail } = form.getFieldsValue();
    const formData = { commitType, commitTime, commitDetail };
    if (!self.networkData.isConnected) {
      alert({
        title: '提示',
        message: '当前网络不可用，我们将保存当前提交的表单数据，待网络通畅后可再次提交',
        buttonName: '确定',
      }).then(() => {
        // eslint-disable-next-line no-console
        console.log('network is invalid, setStorageDraft');
        setStorageDraft(formData);
      });
    } else {
      doSubmit({ values: formData, clearForm: true });
    }
  };

  const onFinishFailed = () => {
    const { commitType, commitTime, commitDetail } = form.getFieldsValue();
    const formData = { commitType, commitTime, commitDetail };
    alert({
      title: '提示',
      message: '当前网络不可用，我们将保存当前提交的表单数据，待网络通畅后可再次提交',
      buttonName: '确定',
    }).then(() => {
      setDraft(formData);
    });
  };

  const onDraftSubmit = () => {
    const { commitType, commitTime, commitDetail } = form.getFieldsValue();
    const formData = { commitType, commitTime, commitDetail };
    if (!self.networkData.isConnected) {
      alert({
        title: '提示',
        message: '当前网络不可用，请稍后再试',
      });
      return;
    }
    doSubmit({
      values: formData,
      msg: '提交成功',
      clearDraft: true,
    });
  };

  const onValuesChange = (e) => {
    if (e.commitType) {
      form.setFieldValue('commitType', e.commitType);
    } else if (e.commitTime) {
      form.setFieldValue('commitTime', e.commitTime);
    } else if (e.commitDetail) {
      form.setFieldValue('commitDetail', e.commitDetail);
    }

    setDirty(true);
  };

  return (
    <>
      <div style={{ paddingBottom: '12px' }}>
        <Network />
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
        form={form}
      >
        <Form.Item name="commitType">
          <Radio.Group>
            <Radio.Button value="issue">报个故障</Radio.Button>
            <Radio.Button value="suggestion">提个建议</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="commitTime">
          <DatePicker />
        </Form.Item>
        <Form.Item name="commitDetail">
          <TextArea rows={4} showCount maxLength={140} placeholder="详情" />
        </Form.Item>
        <Form.Item name="commitButton">
          <Button htmlType="submit">提交当前表单</Button>
        </Form.Item>
      </Form>
      <CommitDraft hasDraft={!!draft} onDraftSubmit={onDraftSubmit} />
      <Tips />
    </>
  );
}

function CommitDraft(props: {
  hasDraft?: boolean;
  onDraftSubmit: () => void;
}) {
  const { hasDraft } = props;
  const onCommitDraft = () => {
    props.onDraftSubmit();
  };
  if (hasDraft) {
    return (
      <div className="pb-[8px]">
        <Button onClick={onCommitDraft}>提交上一次表单</Button>
      </div>
    );
  } else {
    return <></>;
  }
}

function Tips() {
  return (
    <div>
      <div className="text-gray-600 text-sm py-5[px]">
        表单未提交前，草稿会缓存在本地。应用退出后再次进入此页面，可以再次加载表单草稿内容，继续编辑。
      </div>
      <div className="text-gray-600 text-sm py-5[px]">
        在断网环境时提交表单，表单数据会被缓存到本地（不能被再次修改）。等网络通畅并提交成功后，缓存会被自动清理。
      </div>
    </div>
  );
}
