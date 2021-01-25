export interface IUploadedFile {
  _id: string;
  optimized: {
    url: string;
    width: number;
    height: number;
  };
  original: {
    url: string;
    width: number;
    height: number;
  };
  uploadedFromUrl: string;
  temp: boolean;
  tags: string[];
}
