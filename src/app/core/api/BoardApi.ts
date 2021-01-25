import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { IBoard } from 'src/app/types/Boards/IBoard';
import { IUploadedFile } from 'src/app/types/Files/IUploadedFile';

@Injectable()
export class BoardApi {
  constructor(private _http: HttpClient) {}

  private routes = {
    board: `${environment.apiHostUrl}/board`,
    photo: `${environment.apiHostUrl}/board/:boardId/photo`,
  };

  async getBoards(): Promise<IBoard[]> {
    try {
      const res = await this._http.get(this.routes.board).toPromise();

      return res as IBoard[];
    } catch (err) {
      return err.message;
    }
  }

  async createBoard(name: string): Promise<IBoard> {
    const res: any = await this._http
      .post(this.routes.board, {
        name,
      })
      .toPromise();

    return res as IBoard;
  }

  async addPhoto(boardId: string, url: string): Promise<IUploadedFile> {
    const res: any = await this._http
      .post(this.routes.photo.replace(':boardId', boardId), {
        url,
      })
      .toPromise();

    return res as IUploadedFile;
  }

  async updateBoardPhotos(
    boardId: string,
    photos: IUploadedFile[]
  ): Promise<void> {
    await this._http
      .put(this.routes.photo.replace(':boardId', boardId), {
        photos,
      })
      .toPromise();
  }

  async dismissBoardChanges(boardId: string): Promise<void> {
    await this._http
      .delete(this.routes.photo.replace(':boardId', boardId))
      .toPromise();
  }
}
