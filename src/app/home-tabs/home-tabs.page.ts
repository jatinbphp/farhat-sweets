import { Component, OnInit } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})

export class HomeTabsPage implements OnInit 
{
  public is_user_login: boolean = false;//THIS OBSERVABLE IS USED TO SEE USER LOGIN
  public userDetailArray:any=[];//THIS OBSERVABLE IS USED TO SEE USER LOGIN

  constructor(private platform: Platform, public client: ClientService, public actionSheetController: ActionSheetController)
  { 
    this.client.getObservableOnLogin().subscribe((data) => 
    {
      this.is_user_login = data.is_user_login;
    });//THIS OBSERVABLE IS USED TO SEE USER LOGIN
  }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    await this.client.getUserStorageByKey().then(userCap => 
    {
      this.userDetailArray=userCap;
      if(this.userDetailArray != null && this.userDetailArray != undefined)
      {
        this.client.publishSomeDataOnLogin({
          is_user_login: true
        });
      }
    });//THIS OBSERVABLE IS USED TO SEE USER LOGIN
  }
  
  async CheskIsLoggedIn()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-action-sheet',
      buttons: 
      [
        {
          text: "Login",
          cssClass: (this.is_user_login == false) ? "showme" : "hideme",
          icon: "person",          
          handler: () => 
          {            
            this.client.router.navigate(['/login']);
            console.log('Login clicked');
          }
        },
        {
          text: "Account details",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "id-card",          
          handler: () => 
          {            
            this.client.router.navigate(['/account']);
            console.log('Profile clicked');
          }
          
        },
        {
          text: "Change password",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "key",          
          handler: () => 
          {            
            this.client.router.navigate(['/change-password']);
            console.log('Change password clicked');
          }
          
        },
        {
          text: "Addresses",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "business",          
          handler: () => 
          {            
            this.client.router.navigate(['/billing-shipping-addresses']);
            console.log('Addresses clicked');
          }
          
        },
        {
          text: "Orders",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "bag",          
          handler: () => 
          {            
            this.client.router.navigate(['/orders']);
            console.log('Orders clicked');
          }
        },
        {
          text: "Points",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "bowling-ball",          
          handler: () => 
          {            
            console.log('Points clicked');
          }
        },
        {
          text: "Logout",
          cssClass: (this.is_user_login == false) ? "hideme" : "showme",
          icon: "power",          
          handler: () => 
          {            
            this.client.publishSomeDataOnLogin({
              is_user_login: false
            });//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
            this.client.removeStorageByKey();
            this.client.showMessage("You are successfully logged out");
            this.client.router.navigate(['/home']);
            console.log('Logout clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }
  
}
