import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [Camera, File],
})
export class ProfilePage implements OnInit {

  private first_name:string="";
  private last_name:string="";
  private email:string="";
  private avatar: string="";

  constructor(
    public activatedRoute : ActivatedRoute,
    private camera: Camera,
    private file: File
  ) { 
    this.activatedRoute.queryParams.subscribe((res)=>{
      console.log(res.first_name);
      this.first_name = res.first_name;
      this.last_name = res.last_name;
      this.email = res.email;
      this.avatar = res.avatar;
  });
  }

  ngOnInit() {
  }

  openCamera()
  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      //encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log(imageData);
     let filename = imageData.substring(imageData.lastIndexOf('/')+1);
     let path =  imageData.substring(0,imageData.lastIndexOf('/')+1);
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.file.readAsDataURL(path, filename).then(res=>{
       console.log(res);
       this.avatar = res;
     });
     this.avatar = base64Image;
    }, (err) => {
     // Handle error
    });
  }

}
