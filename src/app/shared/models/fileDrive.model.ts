import { BaseEntity } from './baseEntity.model';

export interface FileDrive extends BaseEntity {
  fileName: string;
  fileExtention: string;
  contentType: string;
  fileId: string;
  folderParentId: string;
  documentId: number;
  documentType?: number | null;
  size: number | null;
}

export interface FileRequest {
  folderId?: string | null;
  documentId: number;
  documentType: number;
  rut?: string;
  files?: File[] | null;
}
//
