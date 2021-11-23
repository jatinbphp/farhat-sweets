import { Component } from '@angular/core';
import { ClientService } from './providers/client.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent 
{
  public ProductNestedCategories:any=[];
  public ProductCategoriesMain:any=[];
  public ProductCategoriesSub:any=[];
  public queryString: any=[];
  public category_id: any = 0;//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  public sub_category_id: any = 0;//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  public is_user_login: boolean = false;//THIS OBSERVABLE IS USED TO SEE USER LOGIN
  public user_welcome_text: any = '';//THIS OBSERVABLE IS USED TO SEE USER LOGIN
  public userDetailArray:any=[];//THIS OBSERVABLE IS USED TO SEE USER LOGIN

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home', categories: []},//[0]
    { title: 'Shop', url: '/shop', icon: 'search', categories: []},//[1]
    { title: 'Cart', url: '/cart', icon: 'bag', categories: []},//[2]
  ];
  public labels = [
    //{ title: 'Home', url: '/home', icon: 'home'},
    { title: 'About Us', url: 'https://farhatsweets.com/about/', icon: 'clipboard'},
    //{ title: 'Terms & Conditions', url: 'https://farhatsweets.com/privacy-policy/', icon: 'clipboard'},
    { title: 'Privacy Policy', url: 'https://farhatsweets.com/privacy-policy/', icon: 'clipboard'},
    { title: 'Return Policy', url: 'https://farhatsweets.com/return-policy/', icon: 'bus'},
    { title: 'Shipping Policy', url: 'https://farhatsweets.com/shipping-policy/', icon: 'trail-sign'},
    { title: 'Contact', url: 'https://farhatsweets.com/contact/', icon: 'business'},
  ];
  

  constructor(private client: ClientService, private inAppBrowser: InAppBrowser) 
  {
    this.getProductNestedCategories();
    this.client.getObservableOnOnSelectingCatSubCatFromMenu().subscribe((catSubCatSelectedFromMenu) => 
    {    
      this.category_id = catSubCatSelectedFromMenu.category_id;
      this.sub_category_id = catSubCatSelectedFromMenu.sub_category_id;
      //console.log('Data received', catSubCatSelectedFromMenu);
    });//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU

    this.client.getObservableOnLogin().subscribe((data) => 
    {
      this.is_user_login = data.is_user_login;
      if(this.is_user_login == true)
      {
        this.userDetailArray = localStorage.getItem('user');
        this.userDetailArray = JSON.parse(this.userDetailArray);
        //console.log(this.userDetailArray);
        this.user_welcome_text = this.userDetailArray['display_name'];
      }
      else 
      {
        this.userDetailArray = [];
        this.user_welcome_text = "";
      }
    });//THIS OBSERVABLE IS USED TO SEE USER LOGIN

    this.client.getUserStorageByKey().then(userCap => 
    {
      this.userDetailArray=userCap;
      if(this.userDetailArray != null && this.userDetailArray != undefined)
      {
        this.client.publishSomeDataOnLogin({
          is_user_login: true
        });//THIS OBSERVABLE IS USED TO SEE USER LOGIN
        //this.client.router.navigate(['orders']);
      }
    });
  }

  async getProductNestedCategories()
  {
    //PARENT CATEGORIES ONLY
    await this.client.getProductCategories().then((data) => 
    {    
      this.ProductNestedCategories=data;
    });
    this.appPages[1]['categories']=this.ProductNestedCategories;
    console.log(this.ProductNestedCategories);
    //PARENT CATEGORIES ONLY
    /*
    WORKING::NESTED CATEGORIES LIST
    await this.client.getProductNestedCategories().then((data) => 
    {    
      this.ProductNestedCategories=data['nested_category'];
    });//Categories
    
    if(this.ProductNestedCategories.length > 0)
    {
      for(let catM = 0; catM < this.ProductNestedCategories.length; catM ++)
      {
        let objCatMain = 
        {
          id : this.ProductNestedCategories[catM]['ID'],
          title : this.ProductNestedCategories[catM]['title'],
        }
        this.ProductCategoriesMain[catM]=objCatMain;
        this.ProductCategoriesSub = [];
        if(this.ProductNestedCategories[catM]['children'].length > 0)
        {
          for(let catS = 0; catS < this.ProductNestedCategories[catM]['children'].length; catS ++)
          {
            let objCatSub = 
            {
              id : this.ProductNestedCategories[catM]['children'][catS]['ID'],
              title : this.ProductNestedCategories[catM]['children'][catS]['title'],
            }
            this.ProductCategoriesSub[catS]=objCatSub;
          }
          this.ProductCategoriesMain[catM]['sub']=this.ProductCategoriesSub;
        }
        else 
        {
          this.ProductCategoriesMain[catM]['sub']=[];
        }
      }
      this.appPages[1]['categories']=this.ProductCategoriesMain;
      console.log("APP",this.appPages[1]['categories']);
    }
    WORKING::NESTED CATEGORIES LIST
    */
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
  
  showShopScreen(category_id,sub_category_id)
  {
    let category_id_to_take = (sub_category_id == 0) ? category_id : sub_category_id;
    this.queryString = 
    {
      id:category_id_to_take,
      from_screen:"shop",
      cat_and_sub:category_id+"@"+sub_category_id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    
    this.client.router.navigate(['/shop-by-category'], navigationExtras).then(() => 
    {
      window.location.reload();
    });
  }

  showSubCategories(category_id)
  {
    this.queryString = 
    {
      category_id:category_id,
      from_screen:"shop",
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['shop-sub-categories'], navigationExtras);
  }
}
