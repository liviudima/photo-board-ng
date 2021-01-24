import {
  style, animate, animation, AnimationReferenceMetadata
} from '@angular/animations';

export function fadeIn(params?: {
  time?: string
}): AnimationReferenceMetadata {
  const animationParams = Object.assign({
    time: '300ms'
  }, params || {});

  return animation([
    style({
      opacity: 0
    }),
    animate('{{ time }} ease-in', style({
      opacity: 1
    }))
  ], { params: animationParams });
}


export function fadeOut(params?: {
  time?: string
}): AnimationReferenceMetadata {
  const animationParams = Object.assign({
    time: '300ms'
  }, params || {});

  return animation([
    style({
      opacity: 1
    }),
    animate('{{ time }} ease-out', style({
      opacity: 0
    }))
  ], { params: animationParams });
}
