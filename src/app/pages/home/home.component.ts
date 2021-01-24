import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { IBoard } from 'src/app/types/Boards/IBoard';

@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl'],
})
export class HomeComponent implements OnInit {
  @ViewChild('createBoardModal') createBoardModal: ModalComponent;

  boards: IBoard[] = this._activatedRoute.snapshot.data.boards;
  existingBoards = false;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.existingBoards = !!this.boards.length;
  }

  selectBoard() {}

  openBoardModal() {
    this.createBoardModal.show();
  }
}
