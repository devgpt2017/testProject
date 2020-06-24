import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Platform, LoadingController, ToastController} from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers:[Vibration],
})
export class HomePage {

  public searchTerm: string = "";
  userList: any = [];
  public unsubscribeBackEvent: any;
  currentPage: number = 1;
  total_pages:number=0;
  nextBtnDisable: boolean = false;
  prevBtnDisable: boolean = true;
  public visible: boolean = true;

  constructor(
    private userService: UsersService, 
    private loadingController: LoadingController,
    private toastController: ToastController,
    private platform: Platform,
    private vibration: Vibration,
    public router : Router
  ) {}

  ngOnInit() {
    
  }
  async ionViewWillEnter() {

    this.initializeBackButtonCustomHandler();

    //get List of users
    this.getData(this.currentPage);
    
   }

    //Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unsubscribeBackEvent;
  }

   async getData(currentPage:number)
  {
    this.userList = [];
    const loader = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      showBackdrop: true,
    });
    await loader.present();
    
    this.userService.getAllUsers(currentPage).subscribe(data => {
      this.currentPage = data.page;
      this.total_pages = data.total_pages;
      this.userList = data.data;

      for(let user of this.userList)
      {
          user.full_name = user.first_name+" "+user.last_name;
      }

      if(this.currentPage==this.total_pages)
      {
        this.nextBtnDisable = true;
        this.prevBtnDisable = false;
      }
      else if(this.currentPage<this.total_pages)
      {
        this.nextBtnDisable = false;
        this.prevBtnDisable = true;
      }

      loader.dismiss();
      
    },
    error=>{
      loader.dismiss();
      this.showSnackBar(error);
    });
    
  }

  //set data in array after search..
  setFilteredItems() {
    this.userList = this.filterItems(this.searchTerm);
    
    if(this.userList!=undefined)
    {
      if(this.userList.length==0)
      {
        this.vibration.vibrate(500);
        this.showSnackBar("No record found!");
      }
    }
  }

  //to filter on search
  filterItems(searchTerm: any) {
    if(!searchTerm)
    {
      this.getData(this.currentPage);
    }
    else
    {
      return this.userList.filter(item => {
      
        return item.full_name.toLowerCase().indexOf(searchTerm.toLowerCase())>-1;
        
      });
    }
    
  }

   initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999,  () => {
      navigator['app'].exitApp();
    });
    
    /* here priority 101 will be greater then 100  */
  }

  //shows snackbar at bottom of screen
  private async showSnackBar(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });

    toast.present();
  }

  //open profile page
  openProfilePage(item: any)
  {
    this.router.navigate(['/profile'],{
      queryParams: item,
      });
  }

  //get previous records
  getPrevRecord(currentPage: number)
  {
    if(currentPage>1)
    {
      currentPage = currentPage-1;
      this.getData(currentPage);
      this.prevBtnDisable = false;
    }
    else
    {
      this.prevBtnDisable = true;
    }
  }

  //get next records
  getNextRecord(currentPage: number)
  {
   
    if(currentPage<this.total_pages)
    {
      this.nextBtnDisable = false;
      currentPage = currentPage+1;
      this.getData(currentPage);
    }
    else
    {
      this.nextBtnDisable = true;
    }   
    
  }

  //to sort array in ascending order
  sortAsc()
  {
    this.userList = this.userList.sort(function(a,b) {return (a.full_name < b.full_name) ? -1 : (a.full_name > b.full_name) ? 1 : 0 ;});
  }

  //to sort array in descending order
  sortDesc()
  {
    this.userList = this.userList.sort(function(a,b) {return (a.full_name > b.full_name) ? -1 : (a.full_name < b.full_name) ? 1 : 0 ;});
  }

}
