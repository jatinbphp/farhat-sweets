import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-shop-sub-categories',
  templateUrl: './shop-sub-categories.page.html',
  styleUrls: ['./shop-sub-categories.page.scss'],
})

export class ShopSubCategoriesPage implements OnInit 
{
  public ProductSubCategories:any=[];
  public queryString: any=[];
  public queryStringData: any= [];
  public category_id : any = '';
  public from_screen: any = '';
  public ProductCategoryDetail: any = [];
  public categoryImage: string='';
  public cartArray:any=[];//CART RELATED
  public num_of_items_in_cart: any = 0;//CART RELATED
  constructor(private client: ClientService, private route: ActivatedRoute, private router: Router)
  { }

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
    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.category_id=this.queryStringData['category_id'];
    this.from_screen=this.queryStringData['from_screen'];
    
    let dataCategoryDetail = {
      id:this.category_id
    }
    await this.client.getCategoryDetails(dataCategoryDetail).then((data) => 
    {    
      this.ProductCategoryDetail=data;
      if(this.ProductCategoryDetail['image']!=null)
      {
        this.categoryImage=this.ProductCategoryDetail['image']['src'];      
      }
    });//Category detail
    console.log(this.ProductCategoryDetail);

    await this.client.getProductSubCategories(dataCategoryDetail).then((data) => 
    {    
      this.ProductSubCategories=data;      
    });
    console.log(this.ProductSubCategories);
  }

  shopByCategory(category_id)
  {
    this.queryString = 
    {
      id:category_id,
      from_screen:"shop-subcategory",
      cat_and_sub:category_id+"@"+0,
      main_cat_id:this.category_id
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
}
