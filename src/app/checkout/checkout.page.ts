import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit 
{
  public combinationOFCartAndDesgination:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public checkoutDestinationArray:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public selectedStateForCheckout:string='';//IN PURPOSE OF UPS SHIPPING RATE
  public checkoutStatesArray:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public UPSShippingOptions:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public cartArrayForShippingPurpose:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public concProductIDSForShippingPurpose: string = '';//IN PURPOSE OF UPS SHIPPING RATE
  public cartTotalForShippingPurpose:number=0;//IN PURPOSE OF UPS SHIPPING RATE
  public productVariationsForCartProductsForShippingPurpose:any=[];//IN PURPOSE OF UPS SHIPPING RATE
  public productDetailInCartArrayForShippingPurpose:any=[];//IN PURPOSE OF UPS SHIPPING RATE

  public UPSShippingOptionsSelectedID:any='';
  public UPSShippingOptionsSelected:any='';
  public UPSShippingOptionsSelectedRate:any='';
  
  public concProductIDS: string = '';
  public cartTotal:number=0;
  public cartTotalWithUPS:number=0;
  public sortingWithProductKeyArray:any=[];
  public productVariationsForCartProducts:any=[];
  public cartCalculationArray:any=[];
  public productDetailInCartArrayLength: number = 0;
  public productDetailInCartArray:any=[];
  public cartCalculationSortedArray:any=[];
  public cartArray:any=[];
  public cartOrderArray:any=[];
  public userArray:any=[];
  public userData:any=[];
  public shipping_to_different_address : boolean = false;

  public objBilling:any=[];
  public objShipping:any=[];
  public shippingObj:any=[];
  public objOrder:any=[];
  public objOrderArray:any=[];
  public userTotalCredit:number = 0;
  public paymentMethodID:string ='';
  public paymentMethod:string ='';
  public paymentStatus:string = '';
  public objCoupan:any=[];
  public objCoupanArray:any=[];
  public objAppliedCoupanArray:any=[];

  public checkoutForm = this.fb.group({
    billing_first_name: ['', Validators.required],
    billing_last_name: ['', Validators.required],
    billing_company: [''],
    billing_country: [''],
    billing_address_1: ['', Validators.required],
    billing_city: ['', Validators.required],
    billing_state: ['', Validators.required],
    billing_postcode: ['', Validators.required],
    billing_phone: ['', Validators.required],
    billing_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    billing_order_notes: [''],
    shipping_first_name: ['', Validators.required],
    shipping_last_name: ['', Validators.required],
    shipping_company: [''],
    shipping_country: [''],
    shipping_address_1: ['', Validators.required],
    shipping_city: ['', Validators.required],
    shipping_state: ['', Validators.required],
    shipping_postcode: ['', Validators.required],
    shipping_phone: ['', Validators.required],
    shipping_email: ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    coupon_code: [''],
  });

  validation_messages = 
  {    
    'billing_first_name': 
    [
      { type: 'required', message: 'Billing first name is required.' }
    ],
    'billing_last_name': 
    [
      { type: 'required', message: 'Billing last name is required.' }
    ],
    'billing_country': 
    [
      { type: 'required', message: 'Billing country is required.' }
    ],
    'billing_address_1': 
    [
      { type: 'required', message: 'Billing address is required.' }
    ],
    'billing_city': 
    [
      { type: 'required', message: 'Billing city is required.' }
    ],
    'billing_state': 
    [
      { type: 'required', message: 'Billing state is required.' }
    ],
    'billing_postcode': 
    [
      { type: 'required', message: 'Billing zipcode is required.' }
    ],
    'billing_phone': 
    [
      { type: 'required', message: 'Billing phone is required.' }
    ],
    'billing_email': 
    [
      { type: 'required', message: 'Billing email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'shipping_first_name': 
    [
      { type: 'required', message: 'Shipping first name is required.' }
    ],
    'shipping_last_name': 
    [
      { type: 'required', message: 'Shipping last name is required.' }
    ],
    'shipping_country': 
    [
      { type: 'required', message: 'Shipping country is required.' }
    ],
    'shipping_address_1': 
    [
      { type: 'required', message: 'Shipping address is required.' }
    ],
    'shipping_city': 
    [
      { type: 'required', message: 'Shipping city is required.' }
    ],
    'shipping_state': 
    [
      { type: 'required', message: 'Shipping state is required.' }
    ],
    'shipping_postcode': 
    [
      { type: 'required', message: 'Shipping zipcode is required.' }
    ],
    'shipping_phone': 
    [
      { type: 'required', message: 'Shipping phone is required.' }
    ],
    'shipping_email': 
    [
      { type: 'required', message: 'Shipping email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ]
  };

  constructor(private fb: FormBuilder, private loadingCtrl: LoadingController, private client: ClientService)
  { }

  ngOnInit()
  {}

  async ionViewWillEnter()
  { 
    this.cartArray = JSON.parse(localStorage.getItem('cart'));
    this.userArray = localStorage.getItem('user');
    this.userArray = JSON.parse(this.userArray);
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
    await this.client.gerCheckoutStates().then(resultStates => 
    {	
      this.checkoutStatesArray=resultStates['state'];
      //console.log(this.checkoutStatesArray);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
    
    await this.client.getUserDetailByID(this.userArray.ID).then(result => 
    {	
      this.userData=result;
      this.checkoutForm.controls['billing_first_name'].setValue(this.userData['billing']['first_name']);
      this.checkoutForm.controls['billing_last_name'].setValue(this.userData['billing']['last_name']);
      this.checkoutForm.controls['billing_company'].setValue(this.userData['billing']['company']);
      this.checkoutForm.controls['billing_country'].setValue(this.userData['billing']['country']);
      this.checkoutForm.controls['billing_address_1'].setValue(this.userData['billing']['address_1']);
      this.checkoutForm.controls['billing_city'].setValue(this.userData['billing']['city']);
      this.checkoutForm.controls['billing_state'].setValue(this.userData['billing']['state']);
      this.checkoutForm.controls['billing_postcode'].setValue(this.userData['billing']['postcode']);
      this.checkoutForm.controls['billing_phone'].setValue(this.userData['billing']['phone']);
      this.checkoutForm.controls['billing_email'].setValue(this.userData['billing']['email']);

      this.checkoutForm.controls['shipping_first_name'].setValue(this.userData['billing']['first_name']);
      this.checkoutForm.controls['shipping_last_name'].setValue(this.userData['billing']['last_name']);
      this.checkoutForm.controls['shipping_company'].setValue(this.userData['billing']['company']);
      this.checkoutForm.controls['shipping_country'].setValue(this.userData['billing']['country']);
      this.checkoutForm.controls['shipping_address_1'].setValue(this.userData['billing']['address_1']);
      this.checkoutForm.controls['shipping_city'].setValue(this.userData['billing']['city']);
      this.checkoutForm.controls['shipping_state'].setValue(this.userData['billing']['state']);
      this.checkoutForm.controls['shipping_postcode'].setValue(this.userData['billing']['postcode']);
      this.checkoutForm.controls['shipping_phone'].setValue(this.userData['billing']['phone']);
      this.checkoutForm.controls['shipping_email'].setValue(this.userData['billing']['email']);      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
    //console.log(this.userData);    
    
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
        let product_qt = this.cartArray[c].product_qt;
        let product_varient_id=this.cartArray[c].product_varient_id;
        if(product_varient_id > 0)
        {
          let objForCart = 
          {
            product_id : product_id,
            quantity: product_qt,
            variation_id:product_varient_id
          }
          this.cartOrderArray.push(objForCart);
        }
        else
        {
          let objForCart = 
          {
            product_id : product_id,
            quantity: product_qt
          }
          this.cartOrderArray.push(objForCart);
        }
        this.concProductIDS+=product_id;
        this.concProductIDS+=",";
        //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
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
          },
          error => 
          {
            loading.dismiss();//DISMISS LOADER
            console.log();
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

    //IN PURPOSE OF UPS SHIPPING RATE
    this.combinationOFCartAndDesgination = [];
    this.checkoutDestinationArray = [];
    
    let objDestination = {
      'country':'US',
      'state':(this.checkoutForm.controls['billing_state'].value) ? this.checkoutForm.controls['billing_state'].value : this.userData['billing']['state'],
      'postcode':(this.checkoutForm.controls['billing_postcode'].value) ? this.checkoutForm.controls['billing_postcode'].value : this.userData['billing']['postcode'],
      'city':(this.checkoutForm.controls['billing_city'].value) ? this.checkoutForm.controls['billing_city'].value : this.userData['billing']['city'],
      'address':"",
      'address_1':(this.checkoutForm.controls['billing_address_1'].value) ? this.checkoutForm.controls['billing_address_1'].value : this.userData['billing']['address_1'],
      'address_2':"",
    }
    this.checkoutDestinationArray.push(objDestination);

    let objCombination = {
      'cart_product':this.cartArray,
      'destination':this.checkoutDestinationArray
    }

    this.combinationOFCartAndDesgination.push(objCombination);
    this.combinationOFCartAndDesgination = JSON.stringify(this.combinationOFCartAndDesgination);
    console.log("shp",this.combinationOFCartAndDesgination);
    
    await this.client.getCheckoutRatesForStates(this.combinationOFCartAndDesgination).then(resultRate => 
    {
      loading.dismiss();//DISMISS LOADER
      this.UPSShippingOptions = resultRate['ups_rate'];
      for(let value of Object.values(this.UPSShippingOptions))
      {
        if(value['sort']==1)
        {
          this.UPSShippingOptionsSelectedID = value['id'];
          this.UPSShippingOptionsSelected = value['label'];
          this.UPSShippingOptionsSelectedRate = Number(value['cost']);
        }
      }
      //console.log("HELLO",this.UPSShippingOptions.find(v => v.sort === "1").label);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
    this.cartTotalWithUPS = this.cartTotal + this.UPSShippingOptionsSelectedRate;
    //IN PURPOSE OF UPS SHIPPING RATE
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

  show_hide_shipping()
  {
    this.shipping_to_different_address != this.shipping_to_different_address;
    if(this.shipping_to_different_address == true)
    {
      this.checkoutForm.controls['shipping_first_name'].setValue("");
      this.checkoutForm.controls['shipping_last_name'].setValue("");
      this.checkoutForm.controls['shipping_company'].setValue("");
      //this.checkoutForm.controls['shipping_country'].setValue("");
      this.checkoutForm.controls['shipping_address_1'].setValue("");
      this.checkoutForm.controls['shipping_city'].setValue("");
      this.checkoutForm.controls['shipping_state'].setValue("");
      this.checkoutForm.controls['shipping_postcode'].setValue("");
      this.checkoutForm.controls['shipping_phone'].setValue("");
      this.checkoutForm.controls['shipping_email'].setValue("");
    }    
  }

  async selectedState(ev)
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

    this.selectedStateForCheckout = ev.detail.value;
    this.combinationOFCartAndDesgination = [];
    this.checkoutDestinationArray = [];
    
    let objDestination = {
      'country':'US',
      'state':(this.checkoutForm.controls['billing_state'].value) ? this.checkoutForm.controls['billing_state'].value : this.userData['billing']['state'],
      'postcode':(this.checkoutForm.controls['billing_postcode'].value) ? this.checkoutForm.controls['billing_postcode'].value : this.userData['billing']['postcode'],
      'city':(this.checkoutForm.controls['billing_city'].value) ? this.checkoutForm.controls['billing_city'].value : this.userData['billing']['city'],
      'address':"",
      'address_1':(this.checkoutForm.controls['billing_address_1'].value) ? this.checkoutForm.controls['billing_address_1'].value : this.userData['billing']['address_1'],
      'address_2':"",
    }
    this.checkoutDestinationArray.push(objDestination);

    let objCombination = {
      'cart_product':this.cartArray,
      'destination':this.checkoutDestinationArray
    }

    this.combinationOFCartAndDesgination.push(objCombination);
    this.combinationOFCartAndDesgination = JSON.stringify(this.combinationOFCartAndDesgination);
    console.log("shp",this.combinationOFCartAndDesgination);
    
    await this.client.getCheckoutRatesForStates(this.combinationOFCartAndDesgination).then(resultRate => 
    {
      loading.dismiss();//DISMISS LOADER
      this.UPSShippingOptions = resultRate['ups_rate'];
      for(let value of Object.values(this.UPSShippingOptions))
      {
        if(value['sort']==1)
        {
          this.UPSShippingOptionsSelectedID = value['id'];
          this.UPSShippingOptionsSelected = value['label'];
          this.UPSShippingOptionsSelectedRate = Number(value['cost']);
        }
      }
      //console.log("HELLO",this.UPSShippingOptions.find(v => v.sort === "1").label);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
    this.cartTotalWithUPS = this.cartTotal + this.UPSShippingOptionsSelectedRate;    
  }//IN PURPOSE OF UPS SHIPPING RATE

  async upsMethodSelected(ev)
  {
    //TO GET CART TOTAL
    this.cartArrayForShippingPurpose = JSON.parse(localStorage.getItem('cart'));
    if(this.cartArrayForShippingPurpose!=null && this.cartArrayForShippingPurpose.length > 0)
    {
        this.concProductIDSForShippingPurpose = '';      
        this.cartTotalForShippingPurpose = 0;
        this.productVariationsForCartProductsForShippingPurpose = [];
        for(let c=0;c<this.cartArrayForShippingPurpose.length;c++)
        {
            let product_id = this.cartArrayForShippingPurpose[c].product_id;
            let product_qt = this.cartArrayForShippingPurpose[c].product_qt;
            let product_varient_id=this.cartArrayForShippingPurpose[c].product_varient_id;        
            this.concProductIDSForShippingPurpose+=product_id;
            this.concProductIDSForShippingPurpose+=",";
            //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
            if(product_varient_id != null && product_varient_id != undefined && product_varient_id != "" )
            {
              await this.client.getProductVariationDetail(product_id,product_varient_id).then(resultPromotion => 
              {
                let objVariation = {
                  product_id:product_id,
                  variation_id:product_varient_id,
                  variation_price:resultPromotion['price']
                }
                this.productVariationsForCartProductsForShippingPurpose.push(objVariation);
                console.log(this.productVariationsForCartProductsForShippingPurpose);
              });
              console.log(product_varient_id);
            }
            //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
        }
        this.concProductIDSForShippingPurpose=this.concProductIDSForShippingPurpose.substring(0,(this.concProductIDSForShippingPurpose.length)-1);
        await this.client.getMultipleProductsRecords(this.concProductIDSForShippingPurpose).then(result => 
        {
            this.productDetailInCartArrayForShippingPurpose=result;
            this.cartTotalForShippingPurpose=0;
            for(let c=0;c<this.productDetailInCartArrayForShippingPurpose.length;c++)
            {
                let product_id = this.productDetailInCartArrayForShippingPurpose[c].id;
                if(this.cartArrayForShippingPurpose.find(v => v.product_id === product_id))
                {
                    let product_quantity = this.cartArrayForShippingPurpose.find(v => v.product_id === product_id).product_qt;
                    //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
                    let product_price = 0;
                    if(this.productVariationsForCartProductsForShippingPurpose.find(varient => varient.product_id === product_id))
                    {              
                        product_price = this.productVariationsForCartProductsForShippingPurpose.find(varient => varient.product_id === product_id).variation_price;  
                    }
                    else 
                    {
                        product_price = this.productDetailInCartArrayForShippingPurpose[c].price;  
                    }
                    //CHECK IF PRODUCT VARIENT IS FOUND THEN GET VARIENT INFORMATION
                    this.cartTotalForShippingPurpose+=(Number(product_quantity) * Number(product_price));
                }
            }
        });
    }
    //TO GET CART TOTAL
    this.UPSShippingOptionsSelectedID = ev.detail.value;
    this.UPSShippingOptionsSelected = this.UPSShippingOptions[this.UPSShippingOptionsSelectedID]['label'];
    this.UPSShippingOptionsSelectedRate = Number(this.UPSShippingOptions[this.UPSShippingOptionsSelectedID]['cost']);
    this.cartTotalWithUPS = this.cartTotalForShippingPurpose + this.UPSShippingOptionsSelectedRate;
    console.log(this.cartTotalForShippingPurpose);
    console.log(this.UPSShippingOptionsSelectedRate);
  }

  async validateCoupon(form)
  { 
    let couponCode = form.coupon_code;
    await this.client.validateCoupon(couponCode).then(result => 
    {	
      this.objCoupan=result;
      if(this.objCoupan.length > 0)
      {
        let objApplyCoupon = 
        {          
          'code':this.objCoupan[0]['code'],
          //'id':this.objCoupan[0]['id'],            
          'discount':this.objCoupan[0]['discount'],            
          'meta_data':this.objCoupan[0]['meta_data'],          
        }
        this.objCoupanArray.push(objApplyCoupon);
        this.applyCoupon();
      } 
      else 
      {
        this.client.showMessage("Invalid coupon code!");
      }   
      //console.log(this.objCoupan);
      //console.log(this.objCoupan.length);
    },
    error => 
    {
      console.log();
    });    
  }

  async applyCoupon()
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
    let objCoupon = 
    {
      "coupon_lines": this.objCoupanArray 
    }

    await this.client.applyCouponToOrder(this.objOrder.id,objCoupon).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.objAppliedCoupanArray=result;
      if(this.objAppliedCoupanArray['coupon_lines'][0]['id'] > 0)
      {
        console.log(this.objAppliedCoupanArray);
        this.objOrderArray[0]['total']=this.objAppliedCoupanArray['total'];
        this.client.showMessage("Coupon applied!");
      }
      else 
      {
        this.client.showMessage(this.objAppliedCoupanArray['message']);
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      //console.log();
    });    
  }

  async placeOrder(form)
  { 
    //BILLING DETAIL
    let billing_first_name = (form.billing_first_name) ? form.billing_first_name : "";
    let billing_last_name = (form.billing_last_name) ? form.billing_last_name : "";
    let billing_company = (form.billing_company) ? form.billing_company : "";
    let billing_country = (form.billing_country) ? form.billing_country : "";
    let billing_address_1 = (form.billing_address_1) ? form.billing_address_1 : "";
    let billing_city = (form.billing_city) ? form.billing_city : "";
    let billing_state = (form.billing_state) ? form.billing_state : "";
    let billing_postcode = (form.billing_postcode) ? String(form.billing_postcode) : "";
    let billing_phone = (form.billing_phone) ? form.billing_phone : "";
    let billing_email = (form.billing_email) ? form.billing_email : "";
    //SHIPPING DETAIL
    let shipping_first_name = (form.shipping_first_name) ? form.shipping_first_name : "";
    let shipping_last_name = (form.shipping_last_name) ? form.shipping_last_name : "";
    let shipping_company = (form.shipping_company) ? form.shipping_company : "";
    let shipping_country = (form.shipping_country) ? form.shipping_country : "";
    let shipping_address_1 = (form.shipping_address_1) ? form.shipping_address_1 : "";
    let shipping_city = (form.shipping_city) ? form.shipping_city : "";
    let shipping_state = (form.shipping_state) ? form.shipping_state : "";
    let shipping_postcode = (form.shipping_postcode) ? String(form.shipping_postcode) : "";
    let shipping_phone = (form.shipping_phone) ? form.shipping_phone : "";
    let shipping_email = (form.shipping_email) ? form.shipping_email : "";
    
    this.paymentMethodID="test-payment";
    this.paymentMethod="Test Payment";
    this.paymentStatus="pending";

    if(this.shipping_to_different_address == false)
    {
      this.objBilling = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address_1,
        address_2: "",
        city: billing_city,
        state: billing_state,
        postcode: billing_postcode,
        country: billing_country,
        email: billing_email,
        phone: billing_phone
      }

      this.objShipping = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address_1,
        address_2: "",
        city: billing_city,
        state: billing_state,
        postcode: billing_postcode,
        country: billing_country,
        email: billing_email,
        phone: billing_phone        
      }
    }//DELIVERY TO SAME ADDRESS
    else 
    {
      this.objBilling = 
      {
        first_name: billing_first_name,
        last_name: billing_last_name,
        address_1: billing_address_1,
        address_2: "",
        city: billing_city,
        state: billing_state,
        postcode: billing_postcode,
        country: billing_country,
        email: billing_email,
        phone: billing_phone
      }

      this.objShipping = 
      {
        first_name: shipping_first_name,
        last_name: shipping_last_name,
        address_1: shipping_address_1,
        address_2: "",
        city: shipping_city,
        state: shipping_state,
        postcode: shipping_postcode,
        country: "ZA",
        email: shipping_email,
        phone: shipping_phone        
      }
    }//DELIVERY TO DIFFERENT ADDRESS
    
    this.shippingObj = [];    
    let TempShippingObj = 
    {
      method_id: this.UPSShippingOptionsSelectedID,
      method_title: this.UPSShippingOptionsSelected,
      total: String(this.UPSShippingOptionsSelectedRate)
    }
    this.shippingObj.push(TempShippingObj);
    
    let orderObj = 
    {
      customer_id:this.userArray.ID,
      payment_method:this.paymentMethodID,
      payment_method_title: this.paymentMethod,
      status:this.paymentStatus,
      set_paid: false,
      billing: this.objBilling,
      shipping: this.objShipping,
      line_items:this.cartOrderArray,      
      shipping_lines: this.shippingObj,
      fee_lines: [
        {
          name: "Credits",
          total: "-"+this.userTotalCredit,
          tax_status : "none"
        }
      ],
            
    }//REF::https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-an-order
    
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
    await this.client.createAnOrder(orderObj).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.objOrder=result;
      this.objOrderArray.push(this.objOrder);      
      localStorage.removeItem('cart');//REMOVE CART BECAUSE IF USER WENT TO ANOTHER PAGE THEN, THE SAME ORDER WILL BE PLACED AGAIN WITH ALL NEW ORDER ID            
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });

    if(form.billing_order_notes != "" && form.billing_order_notes != null && form.billing_order_notes != undefined)
    {
      let objNote = 
      {
        "note": form.billing_order_notes 
      }
      await this.client.addOrderNote(this.objOrder.id,objNote);      
    }
    this.client.showMessage("Order placed successfully!");    
    console.log(this.objOrderArray);    
  }

  payNow()
  {
    this.client.router.navigate(['orders']);
  }
}
