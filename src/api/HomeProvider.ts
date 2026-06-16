import api from './axiosConfig';

export const AllService = async () => {
  try {
    const response = await api.get(`/customers/services`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AllSlider = async () => {
  try {
    const response = await api.get(`/customers/sliders`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AllBanner = async () => {
  try {
    const response = await api.get(`/customers/banners`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AllProduct = async (slug: string) => {
  try {
    const response = await api.get(`/customers/service-products/${slug}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AddToCart = async (data: any) => {
  try {
    const response = await api.post('/customers/cart/add', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CartItems = async (id: string | number) => {
  try {
    const response = await api.get(`/customers/cart/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const RemoveCartItems = async (data: any) => {
  try {
    const response = await api.post(`/customers/cart/remove`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const UpdateCartItems = async (data: any) => {
  const { customer_id, cart_item_id, qty } = data;
  try {
    const response = await api.put(`/customers/cart/${cart_item_id}`, {
      customer_id: customer_id,
      quantity: qty,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AddNewAddres = async (data: any) => {
  try {
    const response = await api.post(`/customers/addresses/store`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const GetAllAddress = async (id: string | number) => {
  try {
    const response = await api.get(`/customers/addresses/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const PlaceOrder = async (data: any) => {
  try {
    const response = await api.post(`/customers/b2b-orders/create`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const GetNotification = async () => {
  try {
    const response = await api.get(`/customers/broadcast-notifications`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const OrderHistory = async (id: string | number) => {
  try {
    const response = await api.get(`/customers/b2b/order-history/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const MySubscriptionPlans = async (data: any) => {
  try {
    const response = await api.post(`/customers/my-subscription-plans`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const OrderTracker = async (id: string | number) => {
  try {
    const response = await api.get(`/customers/b2b/order-details/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const RefundOrderDetails = async (id: string | number) => {
  try {
    const response = await api.get(`/refund-details/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const ClearAllCart = async (data: any) => {
  try {
    const response = await api.post(`/customers/cart/clear`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AllproductPricing = async () => {
  try {
    const response = await api.get(`/customers/products/pricelist`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CancelOrder = async (id: string | number) => {
  try {
    const response = await api.post(`/customers/b2b/order-cancel/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const AllCollectionCenter = async () => {
  try {
    const response = await api.get(`/customers/show/collection-centers`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const SetDefaultAddress = async (id: string | number) => {
  try {
    const response = await api.post(`/customers/address/set-default`, {
      address_id: id,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const DeleteAddress = async (id: string | number) => {
  try {
    const response = await api.delete(`/customers/addresses/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const InvoiceHistory = async (id: string | number) => {
  try {
    const response = await api.post(`/customers/b2b/invoice-history`, {
      customer_id: id,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CoupounsCode = async (customer: string | number) => {
  try {
    const response = await api.post(`/customers/coupons`, {
      customer_id: customer,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const BillingHistory = async (page?: number) => {
  try {
    const response = await api.post(`/customers/billing-history`, { page });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const EditProfile = async (data: any) => {
  try {
    const customerId = data.customer_id;
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      company_name: data.company_name,
      business_type: data.business_type,
      gst_number: data.gst_number,
    };
    const response = await api.put(`/customers/update/${customerId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const EditAddress = async (data: any) => {
  try {
    const { address_id, address_type, ...rest } = data;
    if (!address_id) {
      throw new Error('address_id is required');
    }
    const normalizedAddressType = address_type
      ? address_type.charAt(0).toUpperCase() +
      address_type.slice(1).toLowerCase()
      : undefined;
    const payload = {
      ...rest,
      address_type: normalizedAddressType,
    };
    const response = await api.put(
      `/customers/address/update/${address_id}`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const ViewInvoice = async (id: string | number) => {
  try {
    const response = await api.get(`/orders/${id}/invoice-view`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const SubscriptionPlans = async () => {
  try {
    const response = await api.get(`/customers/subscription-plans`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const BuySubscription = async (data: any) => {
  try {
    const response = await api.post(`/customers/buy-subscription`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const VerifySubscriptionPayment = async (data: any) => {
  try {
    const response = await api.post(`/customers/verify-subscription-payment`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CheckSubscriptionExpiry = async (data: any) => {
  try {
    const response = await api.post(`/customers/check-subscription-expiry`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const VerifyRazorpayPayment = async (data: any) => {
  try {
    const response = await api.post('/verify-razorpay-payment', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CreateRazorpayOrder = async (data: any) => {
  try {
    const response = await api.post('/create-razorpay-order', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const RetryPayment = async (data: any) => {
  try {
    const response = await api.post('/orders/retry-payment', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const UpdatePaymentStatus = async (data: any) => {
  try {
    const response = await api.post('/update-payment-status', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const WalletCoupons = async (data: any) => {
  try {
    const response = await api.post('/customers/wallet/offers', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const WalletRecharge = async (data: any) => {
  try {
    const response = await api.post('/customers/wallet/create-order', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const WalletVerifyPayment = async (data: any) => {
  try {
    const response = await api.post('/customers/wallet/verify-payment', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const WalletBalance = async (data: any) => {
  try {
    const response = await api.post('/customers/wallet/get', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const WalletTransactionHistory = async (data: any) => {
  try {
    const response = await api.post('/customers/wallet/transactions-history', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CustomerStatus = async (data: any) => {
  try {
    const response = await api.post('/customers/customer-status', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const IssueCategories = async () => {
  try {
    const response = await api.get('/customers/issue-categories');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const CreateSupportTicket = async (data: any) => {
  try {
    const response = await api.post('/customers/submit-issue', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const GetOrderIssues = async (data: any) => {
  try {
    const response = await api.post('/customers/order/issues', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
