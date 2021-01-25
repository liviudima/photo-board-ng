import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { IUploadedFile } from 'src/app/types/Files/IUploadedFile';

@Component({
  selector: 'pb-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.styl'],
})
export class PhotoComponent implements OnInit {
  @Input() image: IUploadedFile;

  totalWidth = 0;
  tags = '';

  ngOnInit() {
    if (this.image) {
      this.tags = this.image.tags.join(', ');
    }
  }
}
