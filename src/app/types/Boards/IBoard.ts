import { IUploadedFile } from '../Files/IUploadedFile';

export interface IBoard {
  _id: string;
  name: string;
  photos: IUploadedFile[];
}
