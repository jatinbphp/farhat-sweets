import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit 
{
  public cartArray:any=[];//CART RELATED
  public num_of_items_in_cart: any = 0;//CART RELATED
  public nonce:string='';
  public userCookies:any=[];
  public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(8)
		])],
    //password: ['', Validators.required]    
  });
  
  validation_messages = 
  {    
    'username': 
    [
      { type: 'required', message: 'Username is required.' }
    ],
    'password': 
    [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be 8 character long.' },
    ]
  };
  
  constructor(public fb: FormBuilder, public platform: Platform, public loadingCtrl: LoadingController, private client: ClientService, private inAppBrowser: InAppBrowser)
  { }
  
  hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  ngOnInit()
  { }
  
  async ionViewWillEnter()
  {
    //CART RELATED
    this.cartArray = [];
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = JSON.parse(this.cartArray);
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      this.num_of_items_in_cart = this.cartArray.length;
    }
    else 
    {
      this.num_of_items_in_cart = 0;
    }
    //CART RELATED
  }

  async makeMeLoggedin(form)
  {
		let data=
    {
			username:form.username, 
			password:form.password
		}
    
    //GENERATE COOKIE BEFORE LOGIN
    await this.client.getNonce().then((response:any) => 
    {
			this.nonce=response.nonce;
      console.log(response);
		},error => 
    {
      console.log(error);
    });

    await this.client.generateUserCookies(this.nonce,data).then(resultCookie => 
    {	
      this.userCookies = resultCookie;
      if(this.userCookies['status']=="ok")
      {
        this.client.setStorageByKey('userCookie',JSON.stringify(this.userCookies));
      }
      //console.log(this.userCookies);
    },
    error => 
    {
      // loading.dismiss();//DISMISS LOADER
      console.log();
    })
    //GENERATE COOKIE BEFORE LOGIN
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
		await this.client.makeMeLoggedin(data).then(result => 
		{	
      loading.dismiss();//DISMISS LOADER
      this.client.publishSomeDataOnLogin({
        is_user_login: true
      });//THIS OBSERVABLE IS USED TO SEE USER LOGIN
      this.client.showMessage("You are successfully logged in");
      this.client.router.navigate(['home']);
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		})
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
}
