import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseResponseGeneric } from '@shared/models/baseResponseGeneric.model';
import { FileDrive, FileRequest } from '@shared/models/fileDrive.model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private http = inject(HttpClient);

  upload(
    request: Partial<FileRequest>,
  ): Observable<BaseResponseGeneric<FileDrive[]>> {
    const formData = this.buildFormData(request);
    return this.http
      .post<BaseResponseGeneric<FileDrive[]>>(
        `${baseUrl}/drive/upload`,
        formData,
      )
      .pipe
      // tap((response) =>
      //   console.log('driveService.upload.response', response),
      // ),
      ();
  }

  getFilesByFolderId(
    folderId: string,
  ): Observable<BaseResponseGeneric<FileDrive[]>> {
    return this.http
      .get<
        BaseResponseGeneric<FileDrive[]>
      >(`${baseUrl}/drive/files/${folderId}`)
      .pipe(
        tap((response) =>
          console.log('driveService.getFilesByFolderId.response', response),
        ),
      );
  }

  deleteFilesByFileId(
    fileId: string,
  ): Observable<BaseResponseGeneric<boolean>> {
    return this.http
      .delete<BaseResponseGeneric<boolean>>(`${baseUrl}/drive/${fileId}`)
      .pipe
      // tap((response) =>
      //   console.log('driveService.deleteFilesByFileId.response', response),
      // ),
      // switchMap((x) => {

      // }),
      ();
  }

  private buildFormData(request: Partial<FileRequest>): FormData {
    const formData = new FormData();

    if (request.documentId !== undefined) {
      formData.append('documentId', request.documentId.toString());
    }
    if (request.documentType !== undefined) {
      formData.append('documentType', request.documentType.toString());
    }
    if (request.rut !== undefined) {
      formData.append('rut', request.rut);
    }

    if (request.folderId) {
      formData.append('folderId', request.folderId);
    }

    if (request.files && request.files.length > 0) {
      for (const file of request.files) {
        // La clave 'files' coincide con el nombre de la propiedad en el backend (ej. List<IFormFile> Files)
        formData.append('files', file, file.name);
      }
    }

    return formData;
  }
}
