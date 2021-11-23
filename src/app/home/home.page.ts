import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { IonSlides, LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit 
{
  @ViewChild('sliderMainFeaturedProduct', { static: false }) sliderMainFeaturedProduct: IonSlides;//MAULIK::ADDED
  public slideOptionsFeaturedProduct = {   
    spaceBetween: 0,    
    initialSlide: 0,
    autoplay:false,  
    slidesPerView: 3,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    }
  };
  public arrayImageLoaded: any = [];//LAZY LOADING
  public ProductCategories:any=[];
  public queryString: any=[];
  public allBestSeellingProducts:any=[];
  public allBestSeellingProductsLength: number = 0;
  public allBestSeellingProductsLoadMore:any=[];
  public sort_by:string='popularity';
  public sort_by_to_show:string='popularity';
  public order_by:string='desc';
  public currentPage = 1;
  public totalNumberOfPages: number = 0;
  public cartArray:any=[];//CART RELATED
  public num_of_items_in_cart: any = 0;//CART RELATED
  constructor(public client: ClientService, public loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { 
    this.showHomeContent();
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

  async showHomeContent()
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
    await this.client.getProductCategories().then((data) => 
    {    
      this.ProductCategories=data;
    });//Categories
    console.log(this.ProductCategories);

    await this.client.getBestSellingProducts(this.currentPage,this.sort_by,this.order_by).then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.allBestSeellingProducts=result['data'];
      this.totalNumberOfPages=Number(result['totalPages']);
      this.allBestSeellingProductsLength=this.allBestSeellingProducts.length;
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });//Bestselling Products
    console.log(this.allBestSeellingProducts);
  }

  async loadMoreProducts()
  {
    this.currentPage += 1;
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
    await this.client.getBestSellingProducts(this.currentPage,this.sort_by,this.order_by).then(result => 
    { 
      loading.dismiss();//DISMISS LOADER
      this.allBestSeellingProductsLoadMore=result['data'];      
      if(this.allBestSeellingProductsLoadMore.length > 0)
      {
        for(let p=0;p<this.allBestSeellingProductsLoadMore.length;p++)
        {
          this.allBestSeellingProducts.push(this.allBestSeellingProductsLoadMore[p]);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    })//Bestselling Products
  }

  swipeNextFeaturedProductMain()
  {
    this.sliderMainFeaturedProduct.slideNext();
  }

  swipePreviousFeaturedProductMain()
  {
    this.sliderMainFeaturedProduct.slidePrev();
  }

  shopByCategory(category_id)
  {
    this.queryString = 
    {
      id:category_id,
      from_screen:"home",
      cat_and_sub:category_id+"@"+0
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

  showProductDetail(product_id)
  {
    console.log(product_id);
    this.queryString = 
    {
      id:product_id,
      from_screen:"home"
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

  doRefresh(ev)
  {
    setTimeout(() => 
    {
        this.showHomeContent();
        ev.target.complete();
    }, 2000);
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
