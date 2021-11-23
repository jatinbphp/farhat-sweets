import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ClientService 
{
  	public api_url: string = "";
	public consumer_key: string = "";
	public consumer_secret: string = "";
	private fooSubjectWhenlOGIN = new Subject<any>();//THIS OBSERVABLE IS USED TO SEE USER LOGIN
	private fooSubjectWhenSelectingCatSubCatFromMenu = new Subject<any>();//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU	
	private fooSubjectWhenItemAddedToCart = new Subject<any>();//THIS OBSERVABLE IS USED TO SHOW UPDATED COUNT IN HEADER
	public userDetailArray:any=[];

	constructor(public http: HttpClient, private alertCtrl: AlertController, public platform: Platform, public router: Router)
  	{ }
  	
  	publishSomeDataOnLogin(data: any) 
	{
		this.fooSubjectWhenlOGIN.next(data);
	}//THIS OBSERVABLE IS USED TO SEE USER LOGIN

	getObservableOnLogin(): Subject<any> 
	{
		return this.fooSubjectWhenlOGIN;
	}//THIS OBSERVABLE IS USED TO SEE USER LOGIN

	publishSomeDataOnSelectingCatSubCatFromMenu(data: any) 
	{
		this.fooSubjectWhenSelectingCatSubCatFromMenu.next(data);
	}//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU

	getObservableOnOnSelectingCatSubCatFromMenu(): Subject<any> 
	{
		return this.fooSubjectWhenSelectingCatSubCatFromMenu;
	}//THIS OBSERVABLE IS USED TO SHOW CAT/SUB CAT SELECTED IN MENU

	publishSomeDataWhenItemAddedToCart(data: any) {
        this.fooSubjectWhenItemAddedToCart.next(data);
    }//THIS OBSERVABLE IS USED TO SHOW UPDATED COUNT IN HEADER

    getObservableWhenItemAddedToCart(): Subject<any> {
        return this.fooSubjectWhenItemAddedToCart;
	}//THIS OBSERVABLE IS USED TO SHOW UPDATED COUNT IN HEADER

  	getHeaderOptions(): any 
	{	
		this.api_url = "https://farhatsweets.org/";
		this.consumer_key = "ck_93bec984a289bbc3fad6ad3177303c7eef66c0f7";
		this.consumer_secret = "cs_b992005831acc938cc941dde3b5b96ab0f0cee17";		
		var headers=new HttpHeaders().set('Content-Type','application/json');
		return { headers }		
	}

	getUserStorageByKey() 
	{
		return new Promise((resolve, reject) => 
		{
			this.userDetailArray = localStorage.getItem('user');
			this.userDetailArray = JSON.parse(this.userDetailArray);
			resolve(this.userDetailArray);
		});
	}

  	getNonce()
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("controller",'user').set("method", 'register'); //Create new HttpParams
			this.http.get(this.api_url + "api/get_nonce", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},err => {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

  	async getProductCategories()
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("per_page",'12').set("parent", '0').set("hide_empty", 'true').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/categories", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
			err => 
			{
				reject(err);
			});
		});
	}

	async getProductSubCategories(data)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("per_page",'12').set("parent", data.id).set("hide_empty", 'true').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/categories", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
			err => 
			{
				reject(err);
			});
		});
	}

	async getProductNestedCategories()
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/farhatsweets-api-product-category/nested", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
			err => 
			{
				reject(err);
			});
		});
	}

	getBestSellingProducts(page,sortBy,orderBy)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			//.set("stock_status","instock")ADD THIS PARAMETER TO SHOW PRODUCTS WHICH IS IN STOCK ONLY
			let params = new HttpParams().set("orderby",sortBy).set("status","publish").set("order",orderBy).set("per_page",'50').set("page", page).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { observe: 'response', headers: headers, params: params }).subscribe((res: any) => 
			{
				let totalNumberOfPages = res.headers.get('X-WP-TotalPages');
				let dataToReturn = 
				{
					data : res.body,
					totalPages:totalNumberOfPages
				}
				resolve(dataToReturn);
				//resolve(res);
			},
			err => 
			{
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getCategoryDetails(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/categories/"+data.id+"/", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getProductFromCategory(data,sortBy,orderBy)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			//.set("stock_status","instock")ADD THIS PARAMETER TO SHOW PRODUCTS WHICH IS IN STOCK ONLY
			let params = new HttpParams().set("category",data.id).set("orderby",sortBy).set("order",orderBy).set("status","publish").set("per_page", '50').set("page", data.page).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { observe: 'response', headers: headers, params: params }).subscribe((res: any) => 
			{
				let totalNumberOfPages = res.headers.get('X-WP-TotalPages');
				let dataToReturn = 
				{
					data : res.body,
					totalPages:totalNumberOfPages
				}
				resolve(dataToReturn);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getProductDetailByID(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/"+data.id, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getRelatedProductDetailByID(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("include", data).set("per_page", '100').set("page", '1').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getProductVariations(productID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("orderby",'menu_order').set("order",'asc').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/"+productID+"/variations", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getProductVariationDetail(productID,variationID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products/"+productID+"/variations/"+variationID, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getMultipleProductsRecords(product_ids)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("include",product_ids).set("per_page", '100').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/products", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getSearchedAutocompleteProducts(search_text)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("search",search_text).set("orderby",'popularity').set("order",'asc').set("status","publish").set("per_page", '100').set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/farhatsweets-api-search-products/products", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	makeMeLoggedin(option:any)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("username",option.username).set("password", option.password); //Create new HttpParams
			this.http.get(this.api_url + "wp-json/farhatsweets-api-login/login", { headers: headers, params: params }).subscribe((res: any) => 
			{
				if(res.data==undefined) 
				{
					this.showMessage(res.message);
					reject(res);
				} 
				else 
				{
					this.setStorageByKey('user',JSON.stringify(res.data));
					resolve(res);
				}
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	makeMeRegistered(data,nonce)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("username",data.username).set("email", data.email).set("user_pass", data.cpassword).set("nonce", nonce).set("display_name", data.username); //Create new HttpParams
			this.http.get(this.api_url + "api/user/register/", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	getUserDetailByID(userID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/customers/"+userID, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	async generateUserCookies(nonce,data)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("nonce",nonce).set("username",data.username).set("password",data.password); //Create new HttpParams
			this.http.post(this.api_url + "api/user/generate_auth_cookie", params, data ).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});		
	}
	
	async updateUserInformation(cookie,dataToUpdate)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("first_name", dataToUpdate.first_name).set("last_name", dataToUpdate.last_name).set("display_name", dataToUpdate.display_name).set("email", dataToUpdate.email).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret); //Create new HttpParams
			this.http.post(this.api_url + "api/user/update_user_meta_vars/?cookie="+cookie, params, dataToUpdate ).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				console.log("Error",errorMessage);
				this.showMessage(errorMessage.message);
				reject(errorMessage);
	        });
		});
	}

	async updateUserPassword(cookie,userID,nonce,dataToUpdate)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("nonce",nonce).set("password", dataToUpdate.password).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret); //Create new HttpParams
			//this.http.post(this.api_url + "api/user/update_user_meta_vars/?cookie="+cookie, params, dataToUpdate ).subscribe((res: any) => 
			this.http.post(this.api_url + "wp-json/wp/v2/users/"+userID, params, dataToUpdate ).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				console.log("Error",errorMessage);
				this.showMessage(errorMessage.message);
				reject(errorMessage);
	        });
		});
	}

	async updateUserBillingShippingInformation(cookie, userID, dataToUpdate)
	{	
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("billing.first_name", dataToUpdate.billing.first_name).set("billing.last_name", dataToUpdate.billing.last_name).set("billing.company", dataToUpdate.billing.company).set("billing.country", dataToUpdate.billing.country).set("billing.address_1", dataToUpdate.billing.address_1).set("billing.city", dataToUpdate.billing.city).set("billing.state", dataToUpdate.billing.state).set("billing.postcode", dataToUpdate.billing.postcode).set("billing.phone", dataToUpdate.billing.phone).set("billing.email", dataToUpdate.billing.email).set("shipping.first_name", dataToUpdate.shipping.first_name).set("shipping.last_name", dataToUpdate.shipping.last_name).set("shipping.company", dataToUpdate.shipping.company).set("shipping.country", dataToUpdate.shipping.country).set("shipping.address_1", dataToUpdate.shipping.address_1).set("shipping.city", dataToUpdate.shipping.city).set("shipping.state", dataToUpdate.shipping.state).set("shipping.postcode", dataToUpdate.shipping.postcode).set("shipping.phone", dataToUpdate.shipping.phone).set("shipping.email", dataToUpdate.shipping.email).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret); //Create new HttpParams
			this.http.post(this.api_url + "api/user/update_user_meta_vars/?cookie="+cookie, params, dataToUpdate ).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				console.log("Error",errorMessage);
				this.showMessage(errorMessage.message);
				reject(errorMessage);
	        });
		});
	}

	getAllOrdersByUserID(userID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			let params = new HttpParams().set("per_page", "100").set("page", "1").set("customer", userID).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/orders", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	gerOrderDetailByID(orderID)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/orders/"+orderID, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage['message']);
				reject(errorMessage);
	        });
		});
	}

	gerCheckoutStates()
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/farhatsweets-api-checkout/state/", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage['message']);
				reject(errorMessage);
	        });
		});
	}

	getCheckoutRatesForStates(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("request",data).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);			
			this.http.post(this.api_url + "wp-json/farhatsweets-api-ups-method/rate/", params, data ).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage['message']);
				reject(errorMessage);
	        });
		});
	}

	validateCoupon(couponCode)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();

			let params = new HttpParams().set("code", couponCode).set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.get(this.api_url + "wp-json/wc/v3/coupons/", { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}//REFERENCE::http://www.domainname.com/wp-json/wc/v3/coupons/?code=your_coupon_code

	applyCouponToOrder(orderID,data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.post(this.api_url + "wp-json/wc/v3/orders/"+orderID, data, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage['message']);
				reject(errorMessage);
	        });
		});
	}

	createAnOrder(data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.post(this.api_url + "wp-json/wc/v3/orders", data, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	addOrderNote(orderID,data)
	{
		return new Promise((resolve, reject) => 
		{
			let headers = this.getHeaderOptions();
			
			let params = new HttpParams().set("consumer_key", this.consumer_key).set("consumer_secret", this.consumer_secret);
			this.http.post(this.api_url + "wp-json/wc/v3/orders/"+orderID+"/notes", data, { headers: headers, params: params }).subscribe((res: any) => 
			{
				resolve(res);
			},
	        err => 
	        {
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
	        });
		});
	}

	async setStorageByKey(keyName,keyValue) 
	{
		localStorage.setItem(keyName,keyValue);
	}
	
	removeStorageByKey()
	{
		localStorage.clear();
	}

  	async showMessage(message)
	{
		const alert = await this.alertCtrl.create(
    {
      header: 'Farhat Sweets',
      message: message,
      buttons: 
      [
        {
          text: 'Okay',
          handler: () => 
          {
            //console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
	}

	getErrorMessage(err)
	{	
		console.log(" err : ",err);
		if(err.error != null) {
			return err.error;
		}
		else if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}
}
