import { Component, OnInit } from '@angular/core';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})

export class ProductDetailPage implements OnInit 
{
  //CART RELATED
  public cartArray:any=[];
  public qtyIncrease:any=[];
  public messageToCart: string ='Product added to cart.';
  public ProductVariations: any=[];//Product variation related 
  public ProductVariationsPrice: string = '';//Product variation related
  public ProductVariationsPriceToShow: string = '';//Product variation related
  public ProductVariationsSelected: number = 0;//Product variation related
  public IsProductVariationSelected: boolean = false;//Product variation related
  public num_of_items_in_cart: any = 0;
  public is_cart_has_item_within: boolean = false;
  //CART RELATED

  public queryString: any=[];
  public queryStringData: any= [];
  public productDetails: any = [];
  public productDetailsIMGLength: any = 0;

  public relatedProductIDS: any=[];
  public relatedProductDetails: any=[];
  public relatedProductSlideOptions = 
  {
    autoplay:false,
    loop:false,
    slidesPerView: 2
  };

  public id : any = '';
  public from_screen: any = '';
  public cat_id: any = '';
  public cat_and_sub: any = '';

  constructor(private client: ClientService, private route: ActivatedRoute, private router: Router, public loadingCtrl: LoadingController)
  { 
    this.client.getObservableWhenItemAddedToCart().subscribe((data) => {
      this.is_cart_has_item_within = data.is_cart_has_item_within;
      this.num_of_items_in_cart = this.cartArray.length;
      //console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO SHOW RED DOT ON CART MENU
  }

  ngOnInit() 
  {}

  async ionViewWillEnter()
  {
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.id=this.queryStringData['id'];
    this.from_screen=this.queryStringData['from_screen'];
    this.cat_id=this.queryStringData['cat_id'];
    this.cat_and_sub=this.queryStringData['cat_and_sub'];

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
    let dataProductID=
    {
      id:this.id, 
    }
    await this.client.getProductDetailByID(dataProductID).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER		            
      this.productDetails=result;
      this.productDetailsIMGLength=this.productDetails['images'].length;
      console.log("product details",this.productDetails);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });

    if(this.productDetails.related_ids.length > 0)
    {
      this.relatedProductIDS=this.productDetails.related_ids;
      this.getRelatedProductDetails();      
    }//Related products

    console.log(this.productDetails);
    console.log(this.productDetailsIMGLength);

    await this.client.getProductVariations(this.id).then(result => 
    {
      this.ProductVariations=result;      
    });//Product variation related
    console.log(this.ProductVariations);
    //CART RELATED
    this.cartArray = [];//CART RELATED
    this.qtyIncrease = [];//CART RELATED
    this.ProductVariationsSelected=0;
    this.ProductVariationsPrice='';
    this.ProductVariationsPriceToShow='';
    this.IsProductVariationSelected=false;
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = JSON.parse(this.cartArray);
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      this.num_of_items_in_cart = this.cartArray.length;
      if(this.cartArray.find(v => v.product_id === this.id))
      {
        let existQuantity=this.cartArray.find(v => v.product_id === this.id).product_qt;
        let obj = 
        {
          product_id:this.id,
          product_qt:existQuantity
        };
        this.qtyIncrease.push(obj);
      }
      else 
      {
        let obj = 
        {
          product_id:this.id,
          product_qt:1
        };
        this.qtyIncrease.push(obj);
      }
    }//CHECK IF PRODUCT ALREADY ADDED TO THE CART, THEN TAKE IT'S QUANTITY TO SHOW IN THE FIELD
    else 
    {
      let obj = 
      {
        product_id:this.id,
        product_qt:1
      };
      this.qtyIncrease.push(obj);
      this.num_of_items_in_cart = 0;
    }//NO PRODUCTS IN CART
    console.log("QTY",this.qtyIncrease);
    //CART RELATED
  }

  selectedVariation(optionSelected)
  {
    console.log(optionSelected);
    let splitOptionSelected=optionSelected.split("#");    
    this.ProductVariationsSelected=Number(splitOptionSelected[0]);
    this.ProductVariationsPrice=Number(splitOptionSelected[1]).toFixed(2);
    this.ProductVariationsPriceToShow="R"+this.ProductVariationsPrice;
    if(Number(this.ProductVariationsPrice) > 0)
    {
      this.IsProductVariationSelected = true;
    }
    else
    {
      this.IsProductVariationSelected = false;
    }
    console.log(this.ProductVariationsPrice);
  }//Product variation related

  async getRelatedProductDetails()
  {
    console.log(this.relatedProductIDS);
    if(this.relatedProductIDS.length > 0)
    {
      this.relatedProductDetails = [];
      let concProductIDS='';            
      for(let i=0;i<this.relatedProductIDS.length;i++)
      {
        concProductIDS+=this.relatedProductIDS[i];
        concProductIDS+=",";
      }
      concProductIDS=concProductIDS.substring(0,(concProductIDS.length)-1);
      console.log(concProductIDS);      
      await this.client.getRelatedProductDetailByID(concProductIDS).then(result => 
      {	
        //loading.dismiss();//DISMISS LOADER		            
        this.relatedProductDetails=result;
        console.log(this.relatedProductDetails);
        						
      },
      error => 
      {
        //loading.dismiss();//DISMISS LOADER			
        console.log();
      })//RELATED PRODUCT DETAILS      
    }
  }

  changeToProduct(product_id,from_screen)
  {
    this.queryString = 
    {
      id:product_id,
      from_screen:from_screen
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };

    this.client.router.navigate(['/product-detail'], navigationExtras).then(() => 
    {
      window.location.reload();
    });
  }

  increaseQuantity(product)
  {
    if(this.qtyIncrease.length > 0)
    {
      let productID = product.id;
      
      if(this.qtyIncrease.find(v => v.product_id === productID))
      {
        let quantity = Number(this.qtyIncrease.find(v => v.product_id === productID).product_qt);
        quantity++;
        this.qtyIncrease.find(v => v.product_id === productID).product_qt = quantity;
        //this.updateCart(productID,quantity);
      }      
    }    
  }

  decreaseQuantity(product)
  {    
    if(this.qtyIncrease.length > 0)
    {
      let productID = product.id;
      if(this.qtyIncrease.find(v => v.product_id === productID))
      {
        let quantity = Number(this.qtyIncrease.find(v => v.product_id === productID).product_qt);
        if(quantity > 1)
        {
          quantity--;
          this.qtyIncrease.find(v => v.product_id === productID).product_qt = quantity;
        }
        //this.updateCart(productID,quantity);
      }      
    }    
  }

  updateCart(productID,quantity)
  {
    this.cartArray = localStorage.getItem('cart');
    this.cartArray = JSON.parse(this.cartArray);    
    //if(this.cartArray.length > 0)
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      if(this.cartArray.find(v => v.product_id === productID))
      {
        this.cartArray.find(v => v.product_id === productID).product_qt = quantity;
        this.cartArray.find(v => v.product_id === productID).product_varient_id = this.ProductVariationsSelected;
        this.messageToCart="Product updated to cart.";
      }
      else
      {
        let obj = {
          product_id:productID,
          product_qt:(quantity > 0) ? quantity : 0,
          product_varient_id:(this.ProductVariationsSelected > 0) ? this.ProductVariationsSelected : 0 
        };            
        this.cartArray.push(obj);
        this.messageToCart="Product added to cart.";
      }
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.client.showMessage(this.messageToCart);
    }
    else 
    {
      this.cartArray = [];
      let obj = {
        product_id:productID,
        product_qt:(quantity > 0) ? quantity : 0,
        product_varient_id:(this.ProductVariationsSelected > 0) ? this.ProductVariationsSelected : 0 
      };            
      this.cartArray.push(obj);
      localStorage.setItem('cart',JSON.stringify(this.cartArray));
      this.client.showMessage(this.messageToCart);
    }
    
    this.client.publishSomeDataWhenItemAddedToCart({
      is_cart_has_item_within: true
    });//THIS OBSERVABLE IS USED TO SHOW UPDATED COUNT IN HEADER
  }

  goBack()
  {
    if(this.from_screen == "home")
    {
      this.client.router.navigate(['/home']);
    }
    if(this.from_screen == "shop-subcategory")
    {
      this.client.router.navigate(['/shop']);
    } 
    if(this.from_screen == "shop")
    {
      this.queryString = 
      {
        id:this.cat_id,
        from_screen:this.from_screen,
        cat_and_sub:this.cat_and_sub
      };
      
      let navigationExtras: NavigationExtras = 
      {
        queryParams: 
        {
          special: JSON.stringify(this.queryString)
        }
      };
      this.client.router.navigate(['shop-by-category'], navigationExtras);
      //this.client.router.navigate(['/shop']);
    }   
  }
}
