import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class FileApi {
  constructor(private _http: HttpClient) {}

  upload(file: File) {
    try {
      const formData = new FormData();
      formData.append('photo', file, file.name);
      const req = new HttpRequest(
        'POST',
        `${environment.apiHostUrl}/photo`,
        formData,
        {
          reportProgress: true,
        }
      );

      return this._http.request(req);
    } catch (err) {
      return err.error.message;
    }
  }

  async delete(fileName: string): Promise<void> {
    const params = new HttpParams().set('images', fileName);

    try {
      await this._http
        .delete(`${environment.apiHostUrl}/photo`, { params })
        .toPromise();
    } catch (err) {
      console.error(err);
    }
  }
}
