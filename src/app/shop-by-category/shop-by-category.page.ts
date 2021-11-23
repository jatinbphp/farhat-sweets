import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.page.html',
  styleUrls: ['./shop-by-category.page.scss'],
})

export class ShopByCategoryPage implements OnInit 
{
  public arrayImageLoaded: any = [];//LAZY LOADING
  
  public queryStringData: any= [];
  public ProductCategoryDetail: any = [];
  public categoryImage: string='';
  public queryString: any=[];
  public main_cat_id: string = '';

  public ProductsWithinCategory: any = [];
  public MoreProductsWithinCategory: any = [];
  public id : any = '';
  public from_screen: any = '';
  public sort_by:string='title';
  public sort_by_to_show:string='title';
  public order_by:string='asc';
  public currentPage = 1;
  public totalNumberOfPages: number = 0;
  public cat_and_sub:any='';//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  public category_id:any='';//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  public sub_category_id:any='';//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  public cartArray:any=[];//CART RELATED
  public num_of_items_in_cart: any = 0;//CART RELATED
  constructor(private client: ClientService, private route: ActivatedRoute, private router: Router, public loadingCtrl: LoadingController)
  {}

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
    this.id=this.queryStringData['id'];
    this.from_screen=this.queryStringData['from_screen'];    
    this.main_cat_id=this.queryStringData['main_cat_id'];

    //THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
    this.cat_and_sub=this.queryStringData['cat_and_sub'];
    let split_cat_and_sub=this.cat_and_sub.split("@");
    this.category_id=split_cat_and_sub[0];
    this.sub_category_id=split_cat_and_sub[1];
    this.client.publishSomeDataOnSelectingCatSubCatFromMenu({
      category_id: this.category_id,
      sub_category_id: this.sub_category_id
    });//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU

    let dataCategoryDetail = {
      id:this.id
    }
    this.categoryImage = '';
    
    await this.client.getCategoryDetails(dataCategoryDetail).then((data) => 
    {   
      this.ProductCategoryDetail=data;
      if(this.ProductCategoryDetail['image']!=null)
      {
        this.categoryImage=this.ProductCategoryDetail['image']['src'];      
      }
    });//Category detail
    console.log(this.ProductCategoryDetail);
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
    this.totalNumberOfPages = 0;
    let dataCategoryProducts=
    {
      id:this.id,
      page:this.currentPage 
    }
    await this.client.getProductFromCategory(dataCategoryProducts,this.sort_by,this.order_by).then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.ProductsWithinCategory=result['data'];
      this.totalNumberOfPages=Number(result['totalPages']);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//Products from category
    console.log(this.ProductsWithinCategory);
  }

  async loadMoreProducts()
  {
    this.currentPage += 1;
    let dataCategoryProducts=
    {
      id:this.id,
      page:this.currentPage 
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
    await this.client.getProductFromCategory(dataCategoryProducts,this.sort_by,this.order_by).then(result => 
    { 
      loading.dismiss();//DISMISS LOADER
      this.MoreProductsWithinCategory=result['data'];      
      if(this.MoreProductsWithinCategory.length > 0)
      {
        for(let p=0;p<this.MoreProductsWithinCategory.length;p++)
        {
          this.ProductsWithinCategory.push(this.MoreProductsWithinCategory[p]);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//Bestselling Products
  }

  showProductDetail(product_id)
  {
    console.log(product_id);
    this.queryString = 
    {
      id:product_id,
      from_screen:this.from_screen,
      cat_id:this.id,
      cat_and_sub:this.cat_and_sub
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['product-detail'], navigationExtras);
  }

  goBack()
  {
    if(this.from_screen == "home")
    {
      this.client.router.navigate(['/home']);
    }
    if(this.from_screen == "shop-subcategory")
    {
      this.queryString = 
      {
        category_id:this.main_cat_id,
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
    if(this.from_screen == "shop")
    {
      this.client.router.navigate(['/shop']);
    }   
  }

  ionViewWillLeave()
  {
    this.client.publishSomeDataOnSelectingCatSubCatFromMenu({
      category_id: 0,
      sub_category_id: 0
    });//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU
  }

  imageNotLoaded(imageIndex)
  {
    let objImageNotLoaded = 
    {
      'image_index':imageIndex,
      'loaded':false
    }
    //this.arrayImageLoaded.push(objImageNotLoaded);
    this.arrayImageLoaded[imageIndex]=false;
    console.log(this.arrayImageLoaded);
  }//LAZY LOADING

  imageLoaded(imageIndex)
  {
    this.arrayImageLoaded[imageIndex]=true;
    console.log(this.arrayImageLoaded);
  }//LAZY LOADING
}
