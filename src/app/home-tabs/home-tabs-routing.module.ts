import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeTabsPage } from './home-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'shop',
        children: [
          {
            path: '',
            loadChildren: () => import('../shop/shop.module').then( m => m.ShopPageModule)
          }
        ]
      },
      {
        path: 'shop-by-category',
        children: [
          {
            path: '',
            loadChildren: () => import('../shop-by-category/shop-by-category.module').then( m => m.ShopByCategoryPageModule)
          }
        ]
      },
      {
        path: 'shop-sub-categories',
        children: [
          {
            path: '',
            loadChildren: () => import('../shop-sub-categories/shop-sub-categories.module').then( m => m.ShopSubCategoriesPageModule)
          }
        ]
      },
      {
        path: 'product-detail',
        children: [
          {
            path: '',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          }
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
          }
        ]
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            loadChildren: () => import('../register/register.module').then( m => m.RegisterPageModule)
          }
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then( m => m.AccountPageModule)
          }
        ]
      },
      {
        path: 'checkout',
        children: [
          {
            path: '',
            loadChildren: () => import('../checkout/checkout.module').then( m => m.CheckoutPageModule)
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () => import('../orders/orders.module').then( m => m.OrdersPageModule)
          }
        ]
      },
      {
        path: 'order-detail',
        children: [
          {
            path: '',
            loadChildren: () => import('../order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
          }
        ]
      },
      {
        path: 'billing-shipping-addresses',
        children: [
          {
            path: '',
            loadChildren: () => import('../billing-shipping-addresses/billing-shipping-addresses.module').then( m => m.BillingShippingAddressesPageModule)
          }
        ]
      },
      {
        path: 'change-password',
        children: [
          {
            path: '',
            loadChildren: () => import('../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home-tabs/home-tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabsPageRoutingModule {}
