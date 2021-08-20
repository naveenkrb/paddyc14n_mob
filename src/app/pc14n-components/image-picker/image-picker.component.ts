import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

export interface ImageData {
  image: string;
  format: string;
}
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<ImageData>();
  selectedImage: string;

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.showAlert('Camera capability is not available');
      return false; //TODO
    }

    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 600,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.selectedImage = image.dataUrl;
      this.imagePick.emit({ image: this.selectedImage, format: image.format });
    }).catch(error => {
      //console.log(error);
      this.showAlert('Error while taking picture. Please retry');
      return false;
    });
  }

  private showAlert(_message: string) {
    this.alertController.create({
      header: 'Image Picker failure ...',
      keyboardClose: true,
      buttons: ['Ok'],
      message: _message
    }).then(ae => ae.present());
  }
}
