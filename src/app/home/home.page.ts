import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {
  CanvasCameraCameraFacing,
  CanvasCameraUserOptions,
  CanvasCameraFrame,
  CanvasCameraData,
  CanvasCameraEvent,
} from 'com.virtuoworks.cordova-plugin-canvascamera';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('fullsize') fullsizeCanvas: ElementRef;
  @ViewChild('thumbnail') thumbnailCanvas: ElementRef;

  private flash = false;
  private flipStatus = {
    hasListener: false,
    flipped: false,
    scaleH: 1,
    scaleV: 1,
  };

  private position: CanvasCameraCameraFacing = 'back';
  private options: CanvasCameraUserOptions = {
    canvas: {
      width: 320,
      height: 240,
    },
    capture: {
      width: 320,
      height: 240,
    },
    use: 'file',
    fps: 30,
    flashMode: this.flash,
    hasThumbnail: true,
    thumbnailRatio: 1 / 6,
    cameraFacing: this.position,
  };

  ngAfterViewInit() {
    CanvasCamera.initialize({
      fullsize: this.fullsizeCanvas.nativeElement,
      thumbnail: this.thumbnailCanvas.nativeElement,
    });
  }

  play() {
    console.log('play');
    if (CanvasCamera) {
      CanvasCamera.start(
        this.options,
        (error) => {
          console.log('[CanvasCamera start]', 'error', error);
        },
        (data) => {
          console.log('[CanvasCamera start]', 'data', data);
        }
      );
    }
  }

  switch() {
    console.log('switch');
    if (CanvasCamera) {
      this.position = this.position === 'front' ? 'back' : 'front';
      CanvasCamera.cameraPosition(
        this.position,
        (error) => {
          console.log('[CanvasCamera cameraPosition]', error);
        },
        (data: CanvasCameraData) => {
          console.log('[CanvasCamera cameraPosition]', 'data', data);
        }
      );
    }
  }

  flip() {
    console.log('flip');
    if (CanvasCamera) {
      const self = this;
      if (self.flipStatus.flipped) {
        self.flipStatus.scaleH = 1;
        self.flipStatus.scaleV = 1;
        self.flipStatus.flipped = false;
      } else {
        self.flipStatus.scaleH = -1;
        self.flipStatus.scaleV = -1;
        self.flipStatus.flipped = true;
      }
      console.log('flipStatus', self.flipStatus);
      if (!self.flipStatus.hasListener) {
        self.flipStatus.hasListener = true;
        CanvasCamera.beforeFrameRendering(function(
          event: CanvasCameraEvent,
          frame: CanvasCameraFrame
        ) {
          console.log('beforeFrameRendering');
          this.context.save();
          frame.dWidth = frame.dWidth * self.flipStatus.scaleH;
          frame.dHeight = frame.dHeight * self.flipStatus.scaleV;
          console.log('flipStatus', self.flipStatus);
          this.context.scale(self.flipStatus.scaleH, self.flipStatus.scaleV);
        });
        CanvasCamera.afterFrameRendering(function(event, frame) {
          console.log('afterFrameRendering');
          this.context.restore();
        });
      }
    }
  }

  stop() {
    console.log('stop');
    if (CanvasCamera) {
      CanvasCamera.stop(
        (error) => {
          console.log('[CanvasCamera stop]', 'error', error);
        },
        (data) => {
          console.log('[CanvasCamera stop]', 'data', data);
        }
      );
    }
  }

  torch() {
    console.log('torch');
    if (CanvasCamera) {
      this.flash = this.flash ? false : true;
      console.log('flash', this.flash);
      CanvasCamera.flashMode(
        this.flash,
        (error) => {
          console.log('[CanvasCamera flashMode]', 'error', error);
        },
        (data) => {
          console.log('[CanvasCamera flashMode]', 'data', data);
        }
      );
    }
  }
}
