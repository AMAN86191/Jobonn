import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AddNewAddres,
  AddToCart,
  AllProduct,
  AllproductPricing,
  AllService,
  CancelOrder,
  CartItems,
  ClearAllCart,
  EditAddress,
  GetAllAddress,
  OrderHistory,
  OrderTracker,
  PlaceOrder,
  RemoveCartItems,
  UpdateCartItems,
  DeleteAddress,
  EditProfile,
  AllCollectionCenter,
  SetDefaultAddress,
  CoupounsCode,
  GetNotification,
  InvoiceHistory,

  ViewInvoice,
  VerifySubscriptionPayment,
  BuySubscription,
  SubscriptionPlans,
  CheckSubscriptionExpiry,
  MySubscriptionPlans,
  VerifyRazorpayPayment,
  CreateRazorpayOrder,
  RetryPayment,
  UpdatePaymentStatus,
  AllSlider,
  AllBanner,
  WalletCoupons,
  WalletRecharge,
  WalletVerifyPayment,
  WalletBalance,
  WalletTransactionHistory,
  CustomerStatus,
  RefundOrderDetails,
  IssueCategories,
  CreateSupportTicket,
  GetOrderIssues,
} from '../api/HomeProvider';

// ==================  Interfaces  ==================
interface HomeState {
  cart: any[];
  cartCount: number;
  loadingCart: boolean;
  cartError: any | null;
}

const initialState: HomeState = {
  cart: [],
  cartCount: 0,
  loadingCart: false,
  cartError: null,
};

// ... (existing helper function if needed, but thunks are self-contained)

export const BuySubscriptionSlice = createAsyncThunk(
  'home/BuySubscriptionSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await BuySubscription(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const VerifySubscriptionPaymentSlice = createAsyncThunk(
  'home/VerifySubscriptionPaymentSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await VerifySubscriptionPayment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// New Slices for Payment
export const VerifyRazorpayPaymentSlice = createAsyncThunk(
  'home/VerifyRazorpayPaymentSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await VerifyRazorpayPayment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const CreateRazorpayOrderSlice = createAsyncThunk(
  'home/CreateRazorpayOrderSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await CreateRazorpayOrder(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const RetryPaymentSlice = createAsyncThunk(
  'home/RetryPaymentSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await RetryPayment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const UpdatePaymentStatusSlice = createAsyncThunk(
  'home/UpdatePaymentStatusSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await UpdatePaymentStatus(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


// ==================  Async Thunks  ==================
export const AllServiceSlice = createAsyncThunk(
  'auth/AllServiceSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllService();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const AllSliderSlice = createAsyncThunk(
  'auth/AllSliderSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllSlider();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const AllBannerSlice = createAsyncThunk(
  'auth/AllBannerSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllBanner();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const ProductBySlugSlice = createAsyncThunk(
  'auth/ProductBySlugSlice',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await AllProduct(slug);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix
export const AddToCartSlice = createAsyncThunk(
  'home/AddToCart',
  async (product_data: any, { rejectWithValue }) => {
    try {
      const response = await AddToCart(product_data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix
export const CartItemsSlice = createAsyncThunk(
  'home/CartItems',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await CartItems(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix
export const RemoveCartItemsSlice = createAsyncThunk(
  'home/RemoveCartItems',
  async (data: any, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await RemoveCartItems(data);

      // If API reports success, re-fetch the cart so reducers update consistently
      if (response?.status) {
        const state: any = getState();
        // Try to get customer id from the args, response or store
        const customerId =
          data?.customer_id ??
          data?.customerId ??
          response?.customer_id ??
          response?.customerId ??
          state.auth?.customer?.id;

        // Only dispatch if we have a customer id (CartItemsSlice expects an id)
        if (customerId !== undefined && customerId !== null) {
          await dispatch(CartItemsSlice(customerId));
        } else {
          // @ts-ignore
          await dispatch(CartItemsSlice()); 
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix
export const UpdateCartItemsSlice = createAsyncThunk(
  'home/UpdateCartItems',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await UpdateCartItems(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const AddNewAdressSlice = createAsyncThunk(
  'auth/AddNewAdressSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await AddNewAddres(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const GetAllAddressSlice = createAsyncThunk(
  'auth/GetAllAddressSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await GetAllAddress(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const PlaceOrderSlice = createAsyncThunk(
  'auth//customers/b2b-orders',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await PlaceOrder(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const MySubscriptionPlansSlice = createAsyncThunk(
  'auth/MySubscriptionPlansSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await MySubscriptionPlans(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const GetNotificationSlice = createAsyncThunk(
  'auth/GetNotificationSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetNotification();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const OrderHistorySlice = createAsyncThunk(
  'OrderHistorySlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await OrderHistory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const SubscriptionPlansSlice = createAsyncThunk(
  'SubscriptionPlansSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SubscriptionPlans();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const EditPoofileSlice = createAsyncThunk(
  'EditPoofileSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await EditProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix (pehle OrderHistorySlice jaisa hi tha)
export const OrderTrackerSlice = createAsyncThunk(
  'OrderTrackerSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await OrderTracker(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const RefundOrderDetailsSlice = createAsyncThunk(
  'RefundOrderDetailsSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await RefundOrderDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ unique typePrefix (pehle 'OrderHistorySlice' tha)
export const ClearAllCartSlice = createAsyncThunk(
  'home/ClearAllCart',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await ClearAllCart(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const GetAllProductPricingSlice = createAsyncThunk(
  'home/GetAllProductPricingSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllproductPricing();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const InvoiceHistorySlice = createAsyncThunk(
  'home/InvoiceHistorySlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await InvoiceHistory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const CancelOrderSlice = createAsyncThunk(
  'home/CancelOrderSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await CancelOrder(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const ViewInvoiceSlice = createAsyncThunk(
  'home/ViewInvoiceSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await ViewInvoice(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const EditAdressSlice = createAsyncThunk(
  'home/EditAdressSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await EditAddress(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const DeleteAddressSlice = createAsyncThunk(
  'home/DeleteAddressSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await DeleteAddress(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const CheckSubscriptionExpirySlice = createAsyncThunk(
  'home/CheckSubscriptionExpirySlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await CheckSubscriptionExpiry(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const AllCollectionCenterSlice = createAsyncThunk(
  'home/AllCollectionCenterSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllCollectionCenter();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const SetDefaultAddressSlice = createAsyncThunk(
  'home/SetDefaultAddressSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await SetDefaultAddress(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const GetCouponeCodeSlice = createAsyncThunk(
  'home/GetCouponeCodeSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await CoupounsCode(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const WalletCouponsSlice = createAsyncThunk(
  'home/WalletCouponsSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await WalletCoupons(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const WalletRechargeSlice = createAsyncThunk(
  'home/WalletRechargeSlice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await WalletRecharge(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const WalletVerifyPaymentSlice = createAsyncThunk(
  'home/WalletVerifyPaymentSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await WalletVerifyPayment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const WalletBalanceSlice = createAsyncThunk(
  'home/WalletBalanceSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await WalletBalance(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const WalletTransactionHistorySlice = createAsyncThunk(
  'home/WalletTransactionHistorySlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await WalletTransactionHistory(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const CustomerStatusSlice = createAsyncThunk(
  'home/CustomerStatusSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await CustomerStatus(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const IssueCategoriesSlice = createAsyncThunk(
  'home/IssueCategoriesSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await IssueCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const CreateSupportTicketSlice = createAsyncThunk(
  'home/CreateSupportTicketSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await CreateSupportTicket(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const GetOrderIssuesSlice = createAsyncThunk(
  'home/GetOrderIssuesSlice',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await GetOrderIssues(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ==================  Slice  ==================
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // ✅ 1) CartItems API se cart store me daalna
    builder
      .addCase(CartItemsSlice.pending, state => {
        state.loadingCart = true;
        state.cartError = null;
      })
      .addCase(CartItemsSlice.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingCart = false;

        // yahan pehle bhi res.payload.cart use kar rahe the
        const cart = action.payload?.cart || [];

        state.cart = cart;
        state.cartCount = cart.length;
      })
      .addCase(CartItemsSlice.rejected, (state, action: any) => {
        state.loadingCart = false;
        state.cartError = action.payload || action.error?.message;
      });

    // ✅ 2) AddToCart ke baad bhi cartCount update karo
    builder.addCase(AddToCartSlice.fulfilled, (state, action: PayloadAction<any>) => {
      // agar API response me updated cart aa raha hai:
      const cart = action.payload?.cart ?? state.cart;

      state.cart = cart;
      state.cartCount = cart.length;
    });

    // ✅ 3) RemoveCartItems ke baad update
    builder.addCase(RemoveCartItemsSlice.fulfilled, (state, action: PayloadAction<any>) => {
      const cart = action.payload?.cart ?? state.cart;

      state.cart = cart;
      state.cartCount = cart.length;
    });

    // ✅ 4) UpdateCartItems ke baad update
    builder.addCase(UpdateCartItemsSlice.fulfilled, (state, action: PayloadAction<any>) => {
      const cart = action.payload?.cart ?? state.cart;

      state.cart = cart;
      state.cartCount = cart.length;
    });

    // ✅ 5) ClearAllCart successful hone par local cart bhi clear
    builder.addCase(ClearAllCartSlice.fulfilled, state => {
      state.cart = [];
      state.cartCount = 0;
    });
  },
});

export default homeSlice.reducer;
