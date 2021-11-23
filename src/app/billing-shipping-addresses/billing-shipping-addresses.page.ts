import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-billing-shipping-addresses',
  templateUrl: './billing-shipping-addresses.page.html',
  styleUrls: ['./billing-shipping-addresses.page.scss'],
})

export class BillingShippingAddressesPage implements OnInit 
{
  public checkoutStatesArray:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public userArray:any=[];
  public userData:any=[];
  public userCookie:any=[];
  public userDataOnUpdate:any=[];
  public shipping_to_same_address : boolean = false;

  public billingShippingForm = this.fb.group({
    billing_first_name: ['', Validators.required],
    billing_last_name: ['', Validators.required],
    billing_company: [''],
    billing_country: [''],
    billing_address_1: ['', Validators.required],
    billing_city: ['', Validators.required],
    billing_state: ['', Validators.required],
    billing_postcode: ['', Validators.required],
    billing_phone: ['', Validators.required],
    billing_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    shipping_first_name: ['', Validators.required],
    shipping_last_name: ['', Validators.required],
    shipping_company: [''],
    shipping_country: [''],
    shipping_address_1: ['', Validators.required],
    shipping_city: ['', Validators.required],
    shipping_state: ['', Validators.required],
    shipping_postcode: ['', Validators.required],
    shipping_phone: ['', Validators.required],
    shipping_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],    
  });

  validation_messages = 
  {    
    'billing_first_name': 
    [
      { type: 'required', message: 'Billing first name is required.' }
    ],
    'billing_last_name': 
    [
      { type: 'required', message: 'Billing last name is required.' }
    ],
    'billing_country': 
    [
      { type: 'required', message: 'Billing country is required.' }
    ],
    'billing_address_1': 
    [
      { type: 'required', message: 'Billing address is required.' }
    ],
    'billing_city': 
    [
      { type: 'required', message: 'Billing city is required.' }
    ],
    'billing_state': 
    [
      { type: 'required', message: 'Billing state is required.' }
    ],
    'billing_postcode': 
    [
      { type: 'required', message: 'Billing zipcode is required.' }
    ],
    'billing_phone': 
    [
      { type: 'required', message: 'Billing phone is required.' }
    ],
    'billing_email': 
    [
      { type: 'required', message: 'Billing email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'shipping_first_name': 
    [
      { type: 'required', message: 'Shipping first name is required.' }
    ],
    'shipping_last_name': 
    [
      { type: 'required', message: 'Shipping last name is required.' }
    ],
    'shipping_country': 
    [
      { type: 'required', message: 'Shipping country is required.' }
    ],
    'shipping_address_1': 
    [
      { type: 'required', message: 'Shipping address is required.' }
    ],
    'shipping_city': 
    [
      { type: 'required', message: 'Shipping city is required.' }
    ],
    'shipping_state': 
    [
      { type: 'required', message: 'Shipping state is required.' }
    ],
    'shipping_postcode': 
    [
      { type: 'required', message: 'Shipping zipcode is required.' }
    ],
    'shipping_phone': 
    [
      { type: 'required', message: 'Shipping phone is required.' }
    ],
    'shipping_email': 
    [
      { type: 'required', message: 'Shipping email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ]
  };
  
  constructor(private fb: FormBuilder, private platform: Platform, private loadingCtrl: LoadingController, private client: ClientService)
  { }

  ngOnInit()
  {}

  async ionViewWillEnter()
  { 
    this.userArray = localStorage.getItem('user');
    this.userCookie = localStorage.getItem('userCookie');
    this.userArray = JSON.parse(this.userArray);
    this.userCookie = JSON.parse(this.userCookie);    

    await this.client.gerCheckoutStates().then(resultStates => 
    {	
      this.checkoutStatesArray=resultStates['state'];
      console.log(this.checkoutStatesArray);
    });
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
    await this.client.getUserDetailByID(this.userArray.ID).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.userData=result;
      this.billingShippingForm.controls['billing_first_name'].setValue(this.userData['billing']['first_name']);
      this.billingShippingForm.controls['billing_last_name'].setValue(this.userData['billing']['last_name']);
      this.billingShippingForm.controls['billing_company'].setValue(this.userData['billing']['company']);
      this.billingShippingForm.controls['billing_country'].setValue(this.userData['billing']['country']);
      this.billingShippingForm.controls['billing_address_1'].setValue(this.userData['billing']['address_1']);
      this.billingShippingForm.controls['billing_city'].setValue(this.userData['billing']['city']);
      this.billingShippingForm.controls['billing_state'].setValue(this.userData['billing']['state']);
      this.billingShippingForm.controls['billing_postcode'].setValue(this.userData['billing']['postcode']);
      this.billingShippingForm.controls['billing_phone'].setValue(this.userData['billing']['phone']);
      this.billingShippingForm.controls['billing_email'].setValue(this.userData['billing']['email']);

      this.billingShippingForm.controls['shipping_first_name'].setValue(this.userData['shipping']['first_name']);
      this.billingShippingForm.controls['shipping_last_name'].setValue(this.userData['shipping']['last_name']);
      this.billingShippingForm.controls['shipping_company'].setValue(this.userData['shipping']['company']);
      this.billingShippingForm.controls['shipping_country'].setValue(this.userData['shipping']['country']);
      this.billingShippingForm.controls['shipping_address_1'].setValue(this.userData['shipping']['address_1']);
      this.billingShippingForm.controls['shipping_city'].setValue(this.userData['shipping']['city']);
      this.billingShippingForm.controls['shipping_state'].setValue(this.userData['shipping']['state']);
      this.billingShippingForm.controls['shipping_postcode'].setValue(this.userData['shipping']['postcode']);
      this.billingShippingForm.controls['shipping_phone'].setValue(this.userData['shipping']['phone']);
      this.billingShippingForm.controls['shipping_email'].setValue(this.userData['shipping']['email']);
    },
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
    console.log(this.userData);
  }

  async updateUserInformation(form)
  {
    let dataToUpdate = 
    {
      billing:{
        first_name:form.billing_first_name,
        last_name:form.billing_last_name,
        company:form.billing_company,
        country:form.billing_country,
        address_1:form.billing_address_1,
        city:form.billing_city,
        state:form.billing_state,
        postcode:form.billing_postcode,
        phone:form.billing_phone,
        email:form.billing_email,
      },
      shipping:{
        first_name:form.shipping_first_name,
        last_name:form.shipping_last_name,
        company:form.shipping_company,
        country:form.shipping_country,
        address_1:form.shipping_address_1,
        city:form.shipping_city,
        state:form.shipping_state,
        postcode:form.shipping_postcode,
        phone:form.shipping_phone,
        email:form.shipping_email,
      }
    }
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
    await this.client.updateUserBillingShippingInformation(this.userCookie.cookie, this.userArray.ID, dataToUpdate).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.userDataOnUpdate=result;
      if(this.userDataOnUpdate['status']=="ok")
      {
        this.client.showMessage("Account details updated!");
      }
    },
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
  }

  show_hide_shipping()
  {
    this.shipping_to_same_address != this.shipping_to_same_address;
    if(this.shipping_to_same_address == true)
    {
      this.billingShippingForm.controls['shipping_first_name'].setValue(this.billingShippingForm.controls['billing_first_name'].value);
      this.billingShippingForm.controls['shipping_last_name'].setValue(this.billingShippingForm.controls['billing_last_name'].value);
      this.billingShippingForm.controls['shipping_company'].setValue(this.billingShippingForm.controls['billing_company'].value);
      this.billingShippingForm.controls['shipping_country'].setValue(this.billingShippingForm.controls['billing_country'].value);
      this.billingShippingForm.controls['shipping_address_1'].setValue(this.billingShippingForm.controls['billing_address_1'].value);
      this.billingShippingForm.controls['shipping_city'].setValue(this.billingShippingForm.controls['billing_city'].value);
      this.billingShippingForm.controls['shipping_state'].setValue(this.billingShippingForm.controls['billing_state'].value);
      this.billingShippingForm.controls['shipping_postcode'].setValue(this.billingShippingForm.controls['billing_postcode'].value);
      this.billingShippingForm.controls['shipping_phone'].setValue(this.billingShippingForm.controls['billing_phone'].value);
      this.billingShippingForm.controls['shipping_email'].setValue(this.billingShippingForm.controls['billing_email'].value);
    }
    if(this.shipping_to_same_address == false)
    {
      this.billingShippingForm.controls['shipping_first_name'].setValue("");
      this.billingShippingForm.controls['shipping_last_name'].setValue("");
      this.billingShippingForm.controls['shipping_company'].setValue("");
      this.billingShippingForm.controls['shipping_country'].setValue("");
      this.billingShippingForm.controls['shipping_address_1'].setValue("");
      this.billingShippingForm.controls['shipping_city'].setValue("");
      this.billingShippingForm.controls['shipping_state'].setValue("");
      this.billingShippingForm.controls['shipping_postcode'].setValue("");
      this.billingShippingForm.controls['shipping_phone'].setValue("");
      this.billingShippingForm.controls['shipping_email'].setValue("");
    }    
  }
}
