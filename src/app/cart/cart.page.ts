import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit 
{
  public cartArray:any=[];
  public num_of_items_in_cart: any = 0;//CART RELATED
  public userArray:any=[];
  public cartCalculationArray:any=[];
  public cartCalculationSortedArray:any=[];
  public sortingWithProductKeyArray:any=[];
  public productDetailInCartArray:any=[];
  public productDetailInCartArrayLength: number = 0;  
  public concProductIDS: string = '';
  public cartTotal:number=0;
  public isCartEmpty:boolean=false;
  public messageToCart: string ='Product added to cart.';
  public refreshIntervalId: any;
  public is_cart_button_clicked: boolean = false;
  public productVariationsForCartProducts:any=[];
  public isUserHasConfirmedHisAge:boolean = false;
  public openConfirmationModalCount:number = 0;
  public queryString: any=[];
  constructor(private client: ClientService, private loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
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
    this.cartArray = JSON.parse(localStorage.getItem('cart'));
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      this.num_of_items_in_cart = this.cartArray.length;
    }
    else 
    {
      this.num_of_items_in_cart = 0;
    }
    //CART RELATED
    if(this.cartArray!=null && this.cartArray.length > 0)
    {
      this.concProductIDS = '';      
      this.cartTotal = 0;
      this.sortingWithProductKeyArray = []; 
      this.cartCalculationArray = [];
      this.productVariationsForCartProducts = [];     
      for(let c=0;c<this.cartArray.length;c++)
      {
        let product_id = this.cartArray[c].product_id;
        this.concProductIDS+=product_id;
        this.concProductIDS+=",";
        //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
        let product_varient_id=this.cartArray[c].product_varient_id;
        if(product_varient_id != null && product_varient_id != undefined && product_varient_id != "" )
        {
          await this.client.getProductVariationDetail(product_id,product_varient_id).then(resultPromotion => 
          {
            let objVariation = {
              product_id:product_id,
              variation_id:product_varient_id,
              variation_price:resultPromotion['price']
            }
            this.productVariationsForCartProducts.push(objVariation);
            console.log(this.productVariationsForCartProducts);
          });
          console.log(product_varient_id);
        }
        //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
      }
      this.concProductIDS=this.concProductIDS.substring(0,(this.concProductIDS.length)-1);      
      
      await this.client.getMultipleProductsRecords(this.concProductIDS).then(result => 
      {	
        this.productDetailInCartArray=result;
        this.productDetailInCartArrayLength=this.productDetailInCartArray.length;        
        console.log(this.productDetailInCartArray);
        this.cartTotal=0;
        for(let c=0;c<this.productDetailInCartArray.length;c++)
        {
          let product_id = this.productDetailInCartArray[c].id;
          
          this.sortingWithProductKeyArray.push(product_id);
          if(this.cartArray.find(v => v.product_id === product_id))
          {            
            let product_quantity = this.cartArray.find(v => v.product_id === product_id).product_qt;
            //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
            let product_price = 0;
            if(this.productVariationsForCartProducts.find(varient => varient.product_id === product_id))
            {              
              product_price = this.productVariationsForCartProducts.find(varient => varient.product_id === product_id).variation_price;  
            }
            else 
            {
              product_price = this.productDetailInCartArray[c].price;  
            }
            //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
            //BEFORE::let product_price = this.productDetailInCartArray[c].price;
            this.cartTotal+=(Number(product_quantity) * Number(product_price));
            let eachProduct = (Number(product_quantity) * Number(product_price));
            console.log("LEN BEFORE",this.cartCalculationArray.length);         
            if(this.cartCalculationArray.length > 0 && this.cartCalculationArray.find(v => v.product_id === product_id))
            {
              this.cartCalculationArray.find(v => v.product_id === product_id).product_qt = product_quantity;
              this.cartCalculationArray.find(v => v.product_id === product_id).product_to = eachProduct;
            }
            else 
            {
              let obj = {
                product_id:product_id,
                product_qt:(product_quantity > 0) ? product_quantity : 0,
                product_to:(eachProduct > 0) ? eachProduct : 0
              };            
              this.cartCalculationArray.push(obj);
            }   
            console.log("LEN AFTER",this.cartCalculationArray.length);         
          }          
        }
        //SORTING ARRAY
        this.cartCalculationSortedArray = this.mapOrder(this.cartCalculationArray, this.sortingWithProductKeyArray, 'product_id');
        loading.dismiss();//DISMISS LOADER
        //SORTING ARRAY
        //console.log(this.sortingWithProductKeyArray);
        //console.log(this.cartCalculationSortedArray);
        //console.log(this.cartCalculationArray);	
        					
      },
      error => 
      {
        loading.dismiss();//DISMISS LOADER
        console.log();
      })
    }
    else
    {
      loading.dismiss();//DISMISS LOADER
      if(this.refreshIntervalId)
      {
        clearInterval(this.refreshIntervalId);        
      }      
      this.myCartCount();
    }
  }

  myCartCount()
  {
    //console.log(this.cartArray);
    if(this.cartArray == null || this.cartArray.length == 0)
    {      
      this.isCartEmpty=true;  
      this.productDetailInCartArray=[];//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
      this.productDetailInCartArrayLength=this.productDetailInCartArray.length;//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
      this.cartTotal=0;//THIS OBSERVABLE IS USED TO GET SCREEN LOAD FROM ION WILL ENTER
    }

    this.refreshIntervalId = setTimeout(() => 
    {      
      this.myCartCount();      
    }, 1000);
    
    console.log("basket",this.isCartEmpty);
  }

  mapOrder (array, order, key)
  {  
    array.sort( function (a, b)
    {
      var A = a[key], B = b[key];      
      if (order.indexOf(A) > order.indexOf(B))
      {
        return 1;
      } 
      else 
      {
        return -1;
      }      
    });    
    return array;
  }

  increaseQuantity(product)
  {
    if(this.cartArray.length > 0)
    {
      let productID = product.id;
      
      if(this.cartArray.find(v => v.product_id === productID))
      {
        let quantity = Number(this.cartArray.find(v => v.product_id === productID).product_qt);
        quantity++;
        
        this.cartArray.find(v => v.product_id === productID).product_qt = quantity;
        //Each product pricing        
        let product_quantity = this.cartArray.find(v => v.product_id === productID).product_qt;
        let product_price = this.productDetailInCartArray.find(v => v.id === productID).price
        this.cartTotal+=(1 * Number(product_price));
        let eachProduct = (Number(product_quantity) * Number(product_price));
        
        if(this.cartCalculationArray.find(v => v.product_id === productID))
        {
          this.cartCalculationArray.find(v => v.product_id === productID).product_qt = product_quantity;
          this.cartCalculationArray.find(v => v.product_id === productID).product_to = eachProduct;
        }
        else 
        {
          let obj = {
            product_id:productID,
            product_qt:(product_quantity > 0) ? product_quantity : 0,
            product_to:(eachProduct > 0) ? eachProduct : 0
          };            
          this.cartCalculationArray.push(obj);
        }        
        //Each product pricing
        this.updateCart(productID,quantity);
      }      
    }    
  }

  decreaseQuantity(product)
  {    
    if(this.cartArray.length > 0)
    {
      let productID = product.id;
      if(this.cartArray.find(v => v.product_id === productID))
      {
        let quantity = Number(this.cartArray.find(v => v.product_id === productID).product_qt);
        if(quantity > 1)
        {
          quantity--;
         
          this.cartArray.find(v => v.product_id === productID).product_qt = quantity;        
          //Each product pricing        
          let product_quantity = this.cartArray.find(v => v.product_id === productID).product_qt;
          let product_price = this.productDetailInCartArray.find(v => v.id === productID).price
          this.cartTotal-=(1 * Number(product_price));
          let eachProduct = (Number(product_quantity) * Number(product_price));
          
          if(this.cartCalculationArray.find(v => v.product_id === productID))
          {
            this.cartCalculationArray.find(v => v.product_id === productID).product_qt = product_quantity;
            this.cartCalculationArray.find(v => v.product_id === productID).product_to = eachProduct;
          }
          else 
          {
            let obj = {
              product_id:productID,
              product_qt:(product_quantity > 0) ? product_quantity : 0,
              product_to:(eachProduct > 0) ? eachProduct : 0
            };            
            this.cartCalculationArray.push(obj);
          }   
          if(this.cartTotal <= 0) 
          {
            this.cartTotal=0; 
          }     
          //Each product pricing

          this.updateCart(productID,quantity);
        }
      }            
    }  
  }

  updateCart(productID,quantity)
  {
    if(this.cartArray.find(v => v.product_id === productID))
    {
      this.cartArray.find(v => v.product_id === productID).product_qt = quantity;
      this.messageToCart="Product updated to cart.";      
    }
    else
    {
      let obj = {
        product_id:productID,
        product_qt:(quantity > 0) ? quantity : 0
      };            
      this.cartArray.push(obj);  
      this.messageToCart="Product added to cart.";    
    }
    localStorage.setItem('cart',JSON.stringify(this.cartArray));
    this.client.showMessage(this.messageToCart);
  }

  removeCartItem(productID,productPrice)
  {
    
    this.productDetailInCartArray.some(function(item, index)
    {
      if(this.productDetailInCartArray[index].id === productID)
      { 
        this.productDetailInCartArray.splice(index, 1);
      }
    },this);


    this.cartArray.some(function(item, index)
    {
      if(this.cartArray[index].product_id === productID)
      {
        this.cartArray.splice(index, 1);
      }
    },this);    
    
    this.cartCalculationArray.some(function(item, index)
    {
      if(this.cartCalculationArray[index].product_id === productID)
      {
        this.cartCalculationArray.splice(index, 1);
      }
    },this);        
    
    this.cartTotal -= productPrice;
    this.productDetailInCartArrayLength -= 1;

    if(this.cartArray.length == 0)
    {
      this.isCartEmpty = true;
      this.cartTotal = 0;            
    }
    localStorage.setItem('cart',JSON.stringify(this.cartArray));  
    this.client.showMessage("Product removed from cart.");  
    this.ionViewWillEnter();
  }

  ionViewWillLeave()
	{
		console.log("Fired");
		clearInterval(this.refreshIntervalId);
	}

  async goToCheckoutPage()
  {
    this.userArray = localStorage.getItem('user');
    this.userArray = JSON.parse(this.userArray);
    
    if(this.userArray == null || this.userArray == undefined)
    {
      this.client.router.navigate(['/login']);      
    }
    else 
    {
      this.queryString = 
      {
        cart_total:this.cartTotal
      };

      let navigationExtras: NavigationExtras = 
      {
        queryParams: 
        {
          special: JSON.stringify(this.queryString)
        }
      };
      this.client.router.navigate(['/checkout'], navigationExtras);
    }
  }
}
