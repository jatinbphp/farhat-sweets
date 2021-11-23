import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit 
{
  public queryStringData: any= [];
  public id: string = "";

  public orderDetails: any=[];
  public shippingDetails: any=[];
  public billingDetails: any=[];
  public creditUsedDetails: any=[];
  public totalCreditUsed:string = '0.00';
  public isOrderHasTax:boolean=false;
  constructor(private route: ActivatedRoute, public loadingCtrl: LoadingController, private client: ClientService)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.isOrderHasTax=false;
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.id=this.queryStringData['id'];
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
    await this.client.gerOrderDetailByID(this.id).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER		            
      this.orderDetails=result;
      console.log(this.orderDetails);
      this.shippingDetails=this.orderDetails['shipping'];
      this.billingDetails=this.orderDetails['billing']
      if(this.orderDetails['fee_lines'].length > 0)
      {
        this.creditUsedDetails=this.orderDetails['fee_lines'][0];
        if(this.creditUsedDetails.total != null || this.creditUsedDetails.total != "null" || this.creditUsedDetails.total != undefined)
        {
          this.totalCreditUsed = this.creditUsedDetails.total;
        }
      }
      if(this.orderDetails['tax_lines'].length > 0)
      {
        for(let t=0;t<this.orderDetails['tax_lines'].length;t++)
        {
          if(Number(this.orderDetails['tax_lines'][t].tax_total) > 0)
          {
            this.isOrderHasTax=true;
          } 
        }
      }
      console.log(this.creditUsedDetails);
      //console.log(this.shippingDetails);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//PRODUCT DETAILS
  }

}
