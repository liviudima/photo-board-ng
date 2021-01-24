import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  Input,
  OnDestroy,
  HostListener,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { AnimationBuilder, useAnimation } from '@angular/animations';

import { fadeIn, fadeOut } from '../animations/fade';

/**
 * Reusable modal component
 */
@Component({
  selector: 'pb-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.styl'],
})
export class ModalComponent implements OnInit, OnDestroy {
  private _openAnimation = useAnimation(fadeIn());
  private _closeAnimation = useAnimation(fadeOut());

  @ViewChild('modal') modal: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;
  @Input() title: string;
  @Input() isDismissable = true;

  isOpen = false;

  constructor(
    private _renderer: Renderer2,
    private _animationBuilder: AnimationBuilder
  ) {}

  ngOnInit(): void {
    if (this.modal) {
      const modal = this.modal.nativeElement as HTMLElement;
      modal.hidden = false;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }

  show(): void {
    if (this.isOpen) {
      return;
    }

    this._renderer.addClass(document.body, 'no-scrolling');

    const modal = this.modal.nativeElement as HTMLElement;
    modal.hidden = false;
    this.isOpen = true;

    const factory = this._animationBuilder.build(this._openAnimation);
    const player = factory.create(modal);
    player.play();
  }

  hide(): void {
    if (!this.isOpen) {
      return;
    }

    this._renderer.removeClass(document.body, 'no-scrolling');

    const modal = this.modal.nativeElement as HTMLElement;

    const factory = this._animationBuilder.build(this._closeAnimation);
    const player = factory.create(modal);
    player.play();

    setTimeout(() => {
      modal.hidden = true;
      this.isOpen = false;
    }, 200);
  }

  @HostListener('window:keydown.esc', ['$event'])
  onEsc(event: KeyboardEvent): void {
    if (this.isDismissable) {
      if (event.keyCode === 27 || event.key === 'Escape') {
        event.preventDefault();
        this.hide();
      }
    }
  }
}
