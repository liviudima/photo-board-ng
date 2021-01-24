import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BoardApi } from 'src/app/core/api/BoardApi';
import { IBoard } from 'src/app/types/Boards/IBoard';

@Component({
  selector: 'pb-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.styl'],
})
export class BoardFormComponent implements OnInit {
  @Output() boardCreated = new EventEmitter<IBoard>();

  minLength = 3;
  nameError = '';
  serverError = '';
  boardForm = this._formBuilder.group({
    name: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.pattern(/^[a-z0-9]+$/i),
      ]),
    ],
  });

  constructor(private _formBuilder: FormBuilder, private _boardApi: BoardApi) {}

  async ngOnInit() {}

  async createBoard() {
    this._validateForm();

    if (!this.boardForm.valid) {
      return;
    }

    try {
      await this._boardApi.createBoard(this.boardForm.value.name);
    } catch (err) {
      this.serverError = err.error.message;
    }

    this.boardForm.reset();
  }

  validateInput(): boolean {
    const formControl = this.boardForm.get('name');

    const errors =
      formControl.dirty && formControl.invalid && formControl.errors;

    if (!!errors.required) {
      this.nameError = 'Please add a board name.';
      return true;
    }

    if (!!errors.minlength) {
      this.nameError = `Name should have at least ${this.minLength} characters`;
      return true;
    }

    if (!!errors.pattern) {
      this.nameError = 'Please use only alphanumeric characters.';
      return true;
    }

    this.nameError = '';
    return false;
  }

  private _validateForm() {
    for (const key of Object.keys(this.boardForm.controls)) {
      this.boardForm.controls[key].markAsDirty();
      this.boardForm.controls[key].markAsTouched();
      this.boardForm.controls[key].updateValueAndValidity();
    }
  }
}
