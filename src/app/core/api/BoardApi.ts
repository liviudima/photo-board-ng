import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { IBoard } from 'src/app/types/Boards/IBoard';

@Injectable()
export class BoardApi {
  constructor(private _http: HttpClient) {}

  private routes = {
    board: `${environment.apiHostUrl}/board`,
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
}
