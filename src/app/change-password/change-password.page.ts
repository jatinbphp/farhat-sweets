import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

export class ChangePasswordPage implements OnInit 
{
  public userArray:any=[];
  public userData:any=[];
  public userCookie:any=[];

  public resultData:any;
  public nonce:string='';
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';

  public changePasswordForm = this.fb.group({
    cpassword: ['', Validators.required],    
    password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
    },{validator: this.checkIfMatchingPasswords('password', 'cpassword')
  });

  validation_messages = 
  { 
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'cpassword': 
    [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
      { type: 'notEquivalent', message: 'Password not matches.' },
    ]
  };

  constructor(private fb: FormBuilder, private platform: Platform, private loadingCtrl: LoadingController, private client: ClientService)
  { }

  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string)
	{
		return (group: FormGroup) => 
		{
	    let passwordInput = group.controls[passwordKey],passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value)
			{
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }      
			else
			{
	      return passwordConfirmationInput.setErrors(null);        
	    }
	  }
	}

  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideShowConfirmPassword()
	{
		this.ConfirmPasswordType = this.ConfirmPasswordType === 'text' ? 'password' : 'text';
    this.ConfirmPasswordIcon = this.ConfirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  ngOnInit()
  { }

  async ionViewWillEnter() 
	{
		this.userArray = localStorage.getItem('user');
    this.userCookie = localStorage.getItem('userCookie');
    this.userArray = JSON.parse(this.userArray);
    this.userCookie = JSON.parse(this.userCookie);
    /*
    await this.client.getNonce().then((response:any) => 
    {
			this.nonce=response.nonce;
      console.log(response);
		},error => 
    {
      console.log(error);
    });
    */    
	}

  async updateUserPassword(form)
  {
    let dataToUpdate = 
    {
      password:form.cpassword
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
    await this.client.updateUserPassword(this.userCookie.cookie, this.userArray.ID, this.nonce, dataToUpdate).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result;
      if(this.resultData['status']=="ok")
      {
        this.client.showMessage("Password changed!");
        this.changePasswordForm.reset();
      }
    },
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
  }
}
