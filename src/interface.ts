import { SchemaObject, IPagination, SchemaString } from 'ah-api-type';

export type CMSAdmin = {
  title: string;
  copyright?: string;
  logo?: string;
  rpc: { baseURL: string };

  models: CMSAdminModel[];
  globalConfigs?: CMSAdminGlobalConfig[];
  inspectors?: CMSAdminInspector[];

  localeMap?: Record<string, string>;
  menuLayout?: CMSMenuLayout[];
};

export type CMSMenuLayout = {
  key: string;
  label?: string;
  type?: 'group';
  children?: CMSMenuLayout[];
};

export type CMSAdminModelColumnStyleDefine = {
  typo?: {
    type?: 'secondary' | 'success' | 'warning' | 'danger';
    strong?: boolean;
    italic?: boolean;
    underline?: boolean;
    mark?: boolean;
    copyable?: boolean;
    color?: string;
  };
  display?: { type: 'image' } | { type: 'timestamp' };
};

export type CMSAdminModelPageListColumn = {
  dataIndex: string;
  title?: string;
  width?: number;
  formatter?: string;
  disableTranslate?: boolean;
  sorter?: boolean;
} & CMSAdminModelColumnStyleDefine & { $conditions?: Record<string, CMSAdminModelColumnStyleDefine> };

export type CMSAdminModelPageListAction = {
  name: string;
  text: string;
  confirm?: { text: string };
  extraParam?: { schema: SchemaObject };
};

export type CMSAdminModel = {
  name: string;
  title?: string;

  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;

  page: {
    list: {
      description?: string;
      disableUpdatedTime?: boolean;
      search?: { placeholder?: string };
      filter?: { schema: SchemaObject };
      scroll?: { x?: number };
      columns?: CMSAdminModelPageListColumn[];
      expandable?: { dataIndex: string; title?: string; formatter?: string }[];
      actions?: CMSAdminModelPageListAction[];

      batchExport?: {};
    };
    edit?: {
      schema: SchemaObject;

      /** 创建阶段用这个(若无则回退到 `schema`) */
      createSchema?: SchemaObject;

      /** 编辑阶段用这个(若无则回退到 `schema`) */
      editSchema?: SchemaObject;

      /** 批量创建 */
      batchCreate?: {};

      /** 批量修改 */
      batchEdit?: { idKey: string; idSchema: SchemaString };
    };
  };
};

export type CMSAdminGlobalConfig = {
  name: string;
  title?: string;
  schema: SchemaObject;
};

export type CMSAdminInspector = {
  name: string;
  title?: string;
  panels: CMSAdminInspectorPanel[];
};

export type CMSAdminInspectorPanel = (
  | {
      /** 饼图 */ type: 'Pie';
      /** 颜色映射字段, 默认 type */ colorField?: string;
      /** 角度映射字段, 默认 value */ angleField?: string;
    }
  | {
      /** 折线图 */ type: 'Line';
      /** x 轴字段 */ xField: string;
      /** y 轴字段 */ yField: string;
      /** 分组字段 */ seriesField?: string;
    }
  | {
      /** 柱形图 */ type: 'Column';
      /** x 轴字段 */ xField: string;
      /** y 轴字段 */ yField: string;
    }
) & {
  id: string;
  title: string;
  description?: string;
  dataIndex?: string;
  /** 占据宽度，最大 24，默认 8 */
  span?: number;

  /** 传给 g2plot 的额外参数 */
  extraOptions?: Record<string, any>;
};

export type CMSAdminInspectorData = {
  list: any[];
};

export type CMSAdminPagination<T> = {
  pageSize: number;
  pageNum: number;
  total: number;
  list: T[];
};

export type CMSAdminDT_User = { id: number; nick: string };
export type CMSAdminDT_Model = { id: number; updated_at: string };
export type CMSAdminDT_GlobalConfig = { name: string; updated_at: string; data: any };

export type CMSAdminRPC = {
  // 框架
  getCMSAdminData: { query: any; ret: Partial<CMSAdmin> };

  // 账户
  login: { query: { account: string; password: string }; ret: { token: string } };
  getUserInfo: { query: {}; ret: CMSAdminDT_User };

  // 模型
  listModel: {
    query: { name: string; search?: string; filter?: Record<string, string> } & IPagination;
    ret: CMSAdminPagination<CMSAdminDT_Model>;
  };

  getModel: { query: { name: string; id: number }; ret: CMSAdminDT_Model };
  updateModel: { query: { name: string; id: number; data: any }; ret: any };
  createModel: { query: { name: string; data: any }; ret: CMSAdminDT_Model };
  deleteModel: { query: { name: string; id: number }; ret: any };
  invokeModel: { query: { name: string; id: number; action: { name: string; extraParam?: any } }; ret: any };

  // 分析
  getInspectorData: { query: { name: string; id: string }; ret: CMSAdminInspectorData };

  // 系统
  getGlobalConfig: { query: { name: string }; ret: CMSAdminDT_GlobalConfig };
  updateGlobalConfig: { query: { name: string; data: CMSAdminDT_GlobalConfig }; ret: any };
  getUploadURL: { query: { path: string; mime: string }; ret: { uploadURL: string; distURL: string } };
  invoke: { query: { method: string; arg: any }; ret: any };
};

export type CMSAdminBizTagData =
  | { type: 'preset'; list: (string | { label: string; value: any })[] }
  | { type: 'textarea' }
  | { type: 'date' }
  | { type: 'assets'; accept?: string; image?: { aspect?: number } }
  | { type: 'markdown' }
  | { type: 'linkModel'; targetName: string; formatter?: string; searchCache?: boolean };

export const BizTagDataUtil = {
  stringify: (d: CMSAdminBizTagData) => 'cms:' + JSON.stringify(d),
  parse: (tag: string) => {
    if (!tag.startsWith('cms:')) return;
    tag = tag.replace(/^cms\:/, '');
    return JSON.parse(tag) as CMSAdminBizTagData;
  },
};
