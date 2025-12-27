# SmartBite - Customer Activity Diagram

## Swimlane Activity Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          SmartBite - Customer Activity Diagram                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│   Customer   │   Mobile App     │   Backend API    │    Database      │   Rider          │
└──────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘
      │                 │                  │                  │                  │
      ●                 │                  │                  │                  │
      │                 │                  │                  │                  │
   [Open App]           │                  │                  │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
[Browse Restaurants]    │                  │                  │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
[Select Restaurant]─────┼─────────────────►│                  │                  │
      │                 │      [Show Restaurant Details]      │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
[Browse Menu Items]     │                  │                  │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
[Select Items]          │                  │                  │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
[Add to Cart]───────────┼─────────────────►│                  │                  │
      │                 │        [Update Cart]               │                  │
      │                 │                  │                  │                  │
      ▼                 │                  │                  │                  │
  ◇ More items?         │                  │                  │                  │
   Yes │  No            │                  │                  │                  │
      │   │             │                  │                  │                  │
      └───┘             │                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
   [View Cart]          │                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
   [Proceed to Checkout]│                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
[Select Delivery Address]──────────────────►│                  │                  │
          │             │      [Check Login]                 │                  │
          │             │           │                        │                  │
          │             │      ◇ Not logged in?              │                  │
          │             │      Yes │  No                     │                  │
          │             │          ▼                         │                  │
          │             │    [Login/Register]                │                  │
          │◄────────────┼──────────┘                         │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
[Select Payment Method] │                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
   [Place Order]────────┼─────────────────►│                  │                  │
          │             │         [Create Order]─────────────►│                  │
          │             │                  │      [Validate & Store]            │
          │             │                  │                  │                  │
          │             │                  │◄─────────────────┤                  │
          │             │                  │   [Return Order ID]                │
          │             │                  │                  │                  │
          │             │                  ▼                  │                  │
          │             │         [Process Payment]           │                  │
          │             │                  │                  │                  │
          │             │                  ▼                  │                  │
          │             │         [Confirm Payment]           │                  │
          │             │                  │                  │                  │
          │             │                  ▼                  │                  │
          │             │         [Update Order Status]───────►│                  │
          │             │                  │      [Status: Confirmed]            │
          │             │                  │                  │                  │
          │             │                  ▼                  │                  │
          │             │         [Assign Rider]──────────────┼──────────────────►│
          │             │                  │                  │      [Notify Rider]
          │◄────────────┼──────────────────┤                  │                  │
[View Order Confirmation]                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
[Track Order Status]────┼─────────────────►│                  │                  │
          │             │      [Get Real-time Updates]        │                  │
          │             │                  │                  │                  │
          │             │                  │◄─────────────────┼──────────────────┤
          │             │                  │   [Rider Status Updates]            │
          │             │                  │                  │                  │
          │◄────────────┼──────────────────┤                  │                  │
[View Delivery Progress]│                  │                  │                  │
          │             │                  │                  │                  │
          │             │                  │◄─────────────────┼──────────────────┤
          │             │                  │   [Order Delivered]                 │
          │             │                  │                  │                  │
          │◄────────────┼──────────────────┤                  │                  │
[Receive Order]         │                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
  ◇ Rate Order?         │                  │                  │                  │
   Yes │  No            │                  │                  │                  │
      │   │             │                  │                  │                  │
      ▼   │             │                  │                  │                  │
[Submit Rating]─────────┼─────────────────►│                  │                  │
      │   │             │      [Store Rating]─────────────────►│                  │
      │   │             │                  │                  │                  │
      └───┘             │                  │                  │                  │
          │             │                  │                  │                  │
          ▼             │                  │                  │                  │
[View Order History]────┼─────────────────►│                  │                  │
          │             │      [Fetch Past Orders]────────────►│                  │
          │             │                  │                  │                  │
          │◄────────────┼──────────────────┤                  │                  │
[View Order Details]    │                  │                  │                  │
          │             │                  │                  │                  │
          ●             │                  │                  │                  │
      (End)             │                  │                  │                  │
```

## Key Features Represented:

### Customer Actions:
1. **Browse & Select**: Restaurant browsing and menu selection
2. **Cart Management**: Add items, view cart, modify quantities
3. **Checkout Process**: Address selection, payment method
4. **Order Placement**: Submit order with payment
5. **Order Tracking**: Real-time delivery status updates
6. **Order Completion**: Receive order and provide rating
7. **Order History**: View past orders

### Mobile App Functions:
- Display restaurant details and menu
- Manage shopping cart
- Handle checkout flow
- Show order confirmation
- Provide real-time tracking interface
- Display order history

### Backend API Operations:
- Authenticate users (login/register)
- Process orders and payments
- Assign riders to deliveries
- Manage order status updates
- Handle real-time notifications
- Store ratings and feedback

### Database Operations:
- Validate and store orders
- Update order status
- Store payment information
- Save ratings and reviews
- Maintain order history

### Rider Integration:
- Receive order assignments
- Update delivery status
- Confirm delivery completion

## Decision Points:
- **More items?**: Loop back to browse menu or proceed to checkout
- **Not logged in?**: Redirect to login/register before checkout
- **Rate Order?**: Optional rating after delivery

## Real-time Features:
- Live order status updates
- Rider location tracking
- Push notifications for status changes
- Real-time cart synchronization

---

**Note**: This diagram represents the complete customer journey in the SmartBite food delivery application, from browsing restaurants to receiving orders and providing feedback.
