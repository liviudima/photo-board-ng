import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

// API Provider
import { BoardApi } from '../api/BoardApi';

// Types
import { IBoard } from 'src/app/types/Boards/IBoard';

@Injectable()
export class BoardsResolver implements Resolve<IBoard[]> {
  constructor(private _boardProvider: BoardApi) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<IBoard[]> {
    return await this._boardProvider.getBoards();
  }
}
