import {
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { FileApi } from 'src/app/core/api/FileApi';
import { IUploadedFile } from 'src/app/types/Files/IUploadedFile';

interface IUploadEvent {
  target: EventTarget | null;
}

@Component({
  selector: 'pb-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.styl'],
})
export class FileUploaderComponent implements OnInit {
  @Input() disabled = false;
  @Output() fileUploaded = new EventEmitter<IUploadedFile>();

  @ViewChild('fileSelector') fileSelector: ElementRef | undefined;

  acceptTypes = 'image/jpeg, image/png';
  fileName = '';
  errorMessage = '';
  percentDone = 0;
  transitionDuration = 0.25;

  private _acceptedTypesArray: string[] = ['image/jpeg', 'image/png'];
  private _allowedExtensions = 'jpg, png';
  private _maxFileSizeMb = 12;

  constructor(private _fileHandler: FileApi) {}

  ngOnInit(): void {}

  handleUpload(event: IUploadEvent) {
    this.errorMessage = '';
    if (!event || !event.target) {
      return (this.errorMessage =
        'We are sorry but there was an error trying to upload your file');
    }

    const files: File[] = Array.prototype.slice.call(
      (event.target as HTMLInputElement).files
    );

    if (this.fileSelector) {
      this.fileSelector.nativeElement.value = '';
    }

    const fileToUpload = files[0];

    if (
      this._acceptedTypesArray.length &&
      !this._acceptedTypesArray.includes(fileToUpload.type)
    ) {
      return (this.errorMessage = `Please upload an image that is ${this._allowedExtensions})} (${fileToUpload.name})`);
    }

    if (
      this._maxFileSizeMb &&
      fileToUpload.size > this._maxFileSizeMb * 1000000
    ) {
      return (this.errorMessage = `Please upload an image that is smaller than ${this._maxFileSizeMb}MB (${fileToUpload.name})`);
    }

    const subscription$ = this._fileHandler.upload(fileToUpload).subscribe(
      (status: HttpEvent<HttpProgressEvent>) => {
        switch (status.type) {
          case HttpEventType.Sent: {
            this.percentDone = 0;
            this.transitionDuration = 0.25;
            break;
          }

          case HttpEventType.UploadProgress: {
            const currentProgress = Math.round(
              (status.loaded / status.total) * 100
            );
            if (this.percentDone < currentProgress) {
              this.percentDone = currentProgress;
            }
            if (status.loaded === status.total) {
              setTimeout(() => {
                this.transitionDuration = 1.5;
                this.percentDone = 0;
              }, 1500);
            }
            break;
          }

          case HttpEventType.Response: {
            if (
              status.body &&
              status.body['optimizedUrl'] &&
              status.body['url']
            ) {
              this.fileUploaded.emit({
                _id: status.body['_id'],
                optimizedUrl: status.body['optimizedUrl'],
                url: status.body['url'],
              });
            }

            subscription$.unsubscribe();
            break;
          }

          default:
            break;
        }
      },
      (err) => {
        this.errorMessage =
          err.error && err.error.message
            ? err.error.message
            : 'There was an error trying to process your file!';

        subscription$.unsubscribe();
      }
    );

    return (this.errorMessage = '');
  }

  openFilePicker() {
    if (!this.fileSelector) {
      return;
    }

    this.fileSelector.nativeElement.click();
  }
}
