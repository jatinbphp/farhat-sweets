import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

export class AccountPage implements OnInit 
{
  public userArray:any=[];
  public userData:any=[];
  public userCookie:any=[];
  public userDataOnUpdate:any=[];

  public profileForm = this.fb.group({
    account_first_name: ['', Validators.required],
    account_last_name: ['', Validators.required],
    account_display_name: ['', Validators.required],
    account_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],    
  });

  validation_messages = 
  { 
    'account_first_name': 
    [
      { type: 'required', message: 'First name is required.' }
    ],
    'account_last_name': 
    [
      { type: 'required', message: 'Last name is required.' }
    ],
    'account_email': 
    [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'account_display_name': 
    [
      { type: 'required', message: 'Display name is required.' }
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
      this.profileForm.controls['account_first_name'].setValue(this.userData['first_name']);
      this.profileForm.controls['account_last_name'].setValue(this.userData['last_name']);
      this.profileForm.controls['account_display_name'].setValue(this.userData['display_name']);      
      this.profileForm.controls['account_email'].setValue(this.userData['email']);
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
      first_name:form.account_first_name,
      last_name:form.account_last_name,
      display_name:form.account_display_name,
      email:form.account_email,
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
    await this.client.updateUserInformation(this.userCookie.cookie, dataToUpdate).then(result => 
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
}
