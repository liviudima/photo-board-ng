import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { BoardApi } from 'src/app/core/api/BoardApi';
import { IBoard } from 'src/app/types/Boards/IBoard';
import { IUploadedFile } from 'src/app/types/Files/IUploadedFile';

@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl'],
})
export class HomeComponent implements OnInit {
  @ViewChild('createBoardModal') createBoardModal: ModalComponent;

  boards: IBoard[] = this._activatedRoute.snapshot.data.boards;
  existingBoards = false;
  existingUpdates = false;
  selectedIndex = 0;
  totalWidth = 0;
  selectedBoard: IBoard;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _boardApi: BoardApi
  ) {}

  ngOnInit(): void {
    this.existingBoards = !!this.boards.length;
    if (this.existingBoards) {
      this.selectedBoard = this.boards[this.selectedIndex];
      this.existingUpdates = !!~this.selectedBoard.photos.findIndex(
        (photo) => photo.temp
      );
    }
  }

  changeBoard(event) {
    this._selectBoard(event.target.value);
  }

  openBoardModal() {
    this.createBoardModal.show();
  }

  addUploadedFile(file: IUploadedFile) {
    this.selectedBoard.photos.splice(0, 0, file);
    this.existingUpdates = true;
  }

  addNewBoard(newBoard: IBoard) {
    this.createBoardModal.hide();
    this.boards.push(newBoard);
    this.selectedIndex = this.boards.findIndex(
      (board) => board._id === newBoard._id
    );
    this.selectedBoard = this.boards[this.selectedIndex];
    this.existingUpdates = false;
  }

  async runTaggingApi() {
    const photosWithTags = await this._boardApi.getTags(this.selectedBoard._id);
    this.selectedBoard.photos = photosWithTags;
    this.existingUpdates = true;
  }

  async dismissChanges() {
    if (
      confirm(
        'Are you sure you want to dismiss changes? All updates to the board lost.'
      )
    ) {
      await this._boardApi.dismissBoardChanges(this.selectedBoard._id);
      this.selectedBoard.photos = this.selectedBoard.photos.filter(
        (photo) => !photo.temp
      );
      this.existingUpdates = false;
    }
  }

  async saveBoard() {
    this.selectedBoard.photos = this.selectedBoard.photos.map((photo) => ({
      ...photo,
      temp: false,
    }));
    await this._boardApi.updateBoardPhotos(
      this.selectedBoard._id,
      this.selectedBoard.photos
    );
    this.existingUpdates = false;
  }

  private _selectBoard(boardId: string) {
    this.selectedIndex = this.boards.findIndex(
      (board) => board._id === boardId
    );
    this.selectedBoard = this.boards[this.selectedIndex];
    this.existingUpdates = !!~this.selectedBoard.photos.findIndex(
      (photo) => photo.temp
    );
  }
}
