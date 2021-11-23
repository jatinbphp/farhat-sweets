import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})

export class OrdersPage implements OnInit 
{
  public userDetailArray:any=[];
  public myOrders:any=[];
  public queryString: any=[];

  constructor(private route: ActivatedRoute, public loadingCtrl: LoadingController, private client: ClientService)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  { 
    await this.client.getUserStorageByKey().then(userCap => 
    {
      this.userDetailArray=userCap;
    });

    if(this.userDetailArray != null || this.userDetailArray != undefined)
    {
      //LOADER
      const loading = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loading.present();
      //LOADER
      await this.client.getAllOrdersByUserID(this.userDetailArray.ID).then(result => 
      {	
        loading.dismiss();//DISMISS LOADER		            
        this.myOrders=result;
        console.log(this.myOrders);
      },error => 
      {
        loading.dismiss();//DISMISS LOADER			
        console.log();
      })
    }
    console.log(this.userDetailArray);
  }

  ShowOrderDetails(order_id)
  {
    this.queryString = 
    {
      id:order_id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['/order-detail'], navigationExtras);
  }
}
