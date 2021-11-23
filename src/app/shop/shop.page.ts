import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})

export class ShopPage implements OnInit 
{
  public ProductCategories:any=[];
  public ProductNestedCategories:any=[];
  public queryString: any=[];
  
  public resultsAvailable: boolean = false;//autocomplete related
  public results: any = [];//autocomplete related
  public ignoreNextChange: boolean = false;//autocomplete related
  public productSelected: any = [];//autocomplete related
  public cartArray:any=[];//CART RELATED
  public num_of_items_in_cart: any = 0;//CART RELATED

  constructor(public client: ClientService, public loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { 
    this.showNestedCategories();
  }

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

  async showNestedCategories()
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
    //PARENT CATEGORIES ONLY    
    await this.client.getProductCategories().then((data) => 
    {  
      loading.dismiss();//DISMISS LOADER  
      this.ProductCategories=data;
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
    console.log(this.ProductCategories);
    //PARENT CATEGORIES ONLY
    /*
    WORKING::NESTED CATEGORIES LIST
    await this.client.getProductNestedCategories().then((data) => 
    {    
      this.ProductNestedCategories=data['nested_category'];
    });//Categories
    console.log(this.ProductNestedCategories);
    WORKING::NESTED CATEGORIES LIST
    */
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

  shopByCategory(category_id,sub_category_id)
  {
    let take_category_or_sub_category = (sub_category_id > 0) ? sub_category_id : category_id;
    console.log(category_id);
    this.queryString = 
    {
      id:take_category_or_sub_category,
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
    this.client.router.navigate(['shop-by-category'], navigationExtras);
  }

  onSearchChange(event: any) 
  {
    this.results = [];//autocomplete related
    this.resultsAvailable = false;//autocomplete related
    
    const substring = event.target.value;
    if (this.ignoreNextChange) 
    {
        this.ignoreNextChange = false;
        return;
    }
    
    if(substring!="" && substring!=null && substring!=undefined && substring.length > 3)
    {
      this.client.getSearchedAutocompleteProducts(substring).then((result) => 
      {
        this.results = result['product_data'];
        this.resultsAvailable = true;
        if(this.results.length == 0)
        {
          this.results.push({'name':'No results'})
        }         
      });
    }
    else
    {
      this.results = [];
      this.resultsAvailable = false;
      this.ignoreNextChange = true;
    }    
  }//header search related

  productSelectedAutoComplete(selected: string) :void 
  {
      this.productSelected = selected;      
      console.log(this.productSelected);
      this.results = [];
      this.resultsAvailable = false;
      this.ignoreNextChange = true;

      this.queryString = 
      {
        id:this.productSelected.ID,
        from_screen:"shop"
      };

      let navigationExtras: NavigationExtras = 
      {
        queryParams: 
        {
          special: JSON.stringify(this.queryString)
        }
      };
      this.client.router.navigate(['product-detail'], navigationExtras);
  }//header search related
  
  cancelSearch()
  {
    this.results = [];
    this.resultsAvailable = false;
    this.ignoreNextChange = true;
  }//header search related

  doRefresh(ev)
  {
    setTimeout(() => 
    {
        this.showNestedCategories();
        ev.target.complete();
    }, 2000);
  }
}
