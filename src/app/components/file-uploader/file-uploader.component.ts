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
  @Input() disabled = false;
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

  errorMessage = '';
  serverError = '';

  constructor(private _formBuilder: FormBuilder, private _boardApi: BoardApi) {}

  ngOnInit(): void {}

  async submitFile() {
    this._validateForm();

    if (!this.fileForm.valid) {
      return;
    }

    try {
      await this._boardApi.addPhoto(this.boardId, this.fileForm.value.url);
    } catch (err) {
      this.serverError = err.error.message;
    }
  }

  validateInput(): boolean {
    const formControl = this.fileForm.get('url');

    const errors =
      formControl.dirty && formControl.invalid && formControl.errors;

    if (!!errors.required) {
      this.errorMessage = 'Please add an URL.';
      return true;
    }

    if (!!errors.pattern) {
      console.log(errors.pattern);
      this.errorMessage = 'Please use a valid URL.';
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
