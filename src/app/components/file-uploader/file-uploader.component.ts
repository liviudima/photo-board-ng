import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BoardApi } from 'src/app/core/api/BoardApi';

import { IUploadedFile } from 'src/app/types/Files/IUploadedFile';

@Component({
  selector: 'pb-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.styl'],
})
export class FileUploaderComponent implements OnInit {
  @Input() boardId;
  @Output() fileUploaded = new EventEmitter<IUploadedFile>();

  fileForm = this._formBuilder.group({
    url: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}'
        ),
      ]),
    ],
  });

  disabled = false;
  errorMessage = '';
  serverError = '';

  constructor(private _formBuilder: FormBuilder, private _boardApi: BoardApi) {}

  ngOnInit(): void {}

  async submitFile() {
    if (!this.boardId) {
      this.serverError = 'In order to upload a photo please select a board.';
      return;
    }
    this._validateForm();

    if (!this.fileForm.valid) {
      return;
    }
    this.disabled = true;

    try {
      const uploadedFile = await this._boardApi.addPhoto(
        this.boardId,
        this.fileForm.value.url
      );
      this.fileForm.reset();
      this.fileUploaded.emit(uploadedFile);
      this.serverError = '';
    } catch (err) {
      this.serverError = err.error.message;
    } finally {
      this.disabled = false;
    }
  }

  validateInput(): boolean {
    const formControl = this.fileForm.get('url');

    const errors =
      formControl.dirty && formControl.invalid && formControl.errors;

    if (!!errors.required) {
      this.errorMessage = 'Please add an URL.';
      this.serverError = '';
      return true;
    }

    if (!!errors.pattern) {
      this.errorMessage = 'Please use a valid URL.';
      this.serverError = '';
      return true;
    }

    this.errorMessage = '';
    return false;
  }

  private _validateForm() {
    for (const key of Object.keys(this.fileForm.controls)) {
      this.fileForm.controls[key].markAsDirty();
      this.fileForm.controls[key].markAsTouched();
      this.fileForm.controls[key].updateValueAndValidity();
    }
  }
}
