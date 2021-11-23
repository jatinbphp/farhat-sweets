import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit 
{
  public resultData:any;
  public nonce:string='';
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';
  public accept_tems:boolean=false;
  public registerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    username: ['', Validators.required],
    cpassword: ['', Validators.required],    
    password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
    },{validator: this.checkIfMatchingPasswords('password', 'cpassword')
  });

  validation_messages = 
  {    
    'first_name': 
    [
      { type: 'required', message: 'First name is required.' }
    ],
    'last_name': 
    [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': 
    [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'username': 
    [
      { type: 'required', message: 'Username is required.' }
    ],
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ],
    'cpassword': 
    [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ]
  };

  constructor(private inAppBrowser: InAppBrowser, private fb: FormBuilder, private platform: Platform, private loadingCtrl: LoadingController, private client: ClientService)
  {}

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
  {}

  async ionViewWillEnter() 
	{
    await this.client.getNonce().then((response:any) => 
    {
			this.nonce=response.nonce;
      console.log(response);
		},error => 
    {
      console.log(error);
    });
	}

  redirectTo(targetURL)
  {
    const options : InAppBrowserOptions = {
      location : 'yes',//Or 'no' 
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      zoom : 'yes',//Android only ,shows browser zoom controls 
      hardwareback : 'yes',
      mediaPlaybackRequiresUserAction : 'no',
      shouldPauseOnSuspend : 'no', //Android only 
      closebuttoncaption : 'Close', //iOS only
      disallowoverscroll : 'no', //iOS only 
      toolbar : 'yes', //iOS only 
      enableViewportScale : 'no', //iOS only 
      allowInlineMediaPlayback : 'no',//iOS only 
      presentationstyle : 'pagesheet',//iOS only 
      fullscreen : 'yes',//Windows only    
    };
    let target = "_system";
    this.inAppBrowser.create(targetURL,target,options);
  }
  
  async makeMeRegistered(form)
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
		//LOADER register
		this.client.makeMeRegistered(form,this.nonce).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			if(this.resultData.status=="ok")
			{
				this.client.showMessage("You are successfully registered!<br/>Please login.");
				this.client.router.navigate(['/login']);
			}
			if(this.resultData.status=="error")
			{
				this.client.router.navigate(['/register']);
				this.client.showMessage(this.resultData.error);
			}
		},
		error => 
		{			
			loading.dismiss();//DISMISS LOADER
		})		
  }

  acceptTerms(ev)
  {
    let haveStatus = ev.detail.checked;
    if(haveStatus == true)
    {
      this.accept_tems = true;
    }
    else 
    {
      this.accept_tems = false;
    }
  }
}
