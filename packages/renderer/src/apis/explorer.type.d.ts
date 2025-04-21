export interface ExplorerDisk {
  Access: string
  Availability: string
  BlockSize: string
  Caption: string
  Compressed: string
  ConfigManagerErrorCode: string
  ConfigManagerUserConfig: string
  CreationClassName: string
  Description: string
  DeviceID: string
  DriveType: string
  ErrorCleared: string
  ErrorDescription: string
  ErrorMethodology: string
  FileSystem: string
  FreeSpace: string
  InstallDate: string
  LastErrorCode: string
  MaximumComponentLength: string
  MediaType: string
  Name: string
  NumberOfBlocks: string
  PNPDeviceID: string
  PowerManagementCapabilities: string
  PowerManagementSupported: string
  ProviderName: string
  Purpose: string
  QuotasDisabled: string
  QuotasIncomplete: string
  QuotasRebuilding: string
  Size: string
  Status: string
  StatusInfo: string
  SupportsDiskQuotas: string
  SupportsFileBasedCompression: string
  SystemCreationClassName: string
  SystemName: string
  VolumeDirty: string
  VolumeName: string
  VolumeSerialNumber: string
}

export interface ExplorerFile {
  /** 访问时间 时间戳（毫秒） */
  accessed: number
  /** 创建时间 时间戳（毫秒） */
  created: number
  /** 修改时间 时间戳（毫秒） */
  modified: number
  /** 目录名称 */
  name: string
  /** 目录路径 */
  path: string
  /** 可读权限 */
  readable: boolean
  /** 可写权限 */
  writable: boolean
  /** 目录大小（字节，目录通常为0） */
  size: number
  /** 文件类型 */
  type: 'directory' | 'file' | 'symlink' | 'other'
}

export type ExplorerDir<T = any> = { name: string; children: T[] }
