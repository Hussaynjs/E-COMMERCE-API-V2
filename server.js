// express async errors
require('dotenv').config()
require('express-async-errors')


// npm packages
const express = require('express')
const app = express()
const Stripe = require('stripe')
const cookieParser = require('cookie-parser')



// middlwares
const notFoundErrorMiddleware = require('./middleware/notFoundMiddleware')
const errohMiddlewareHandler = require('./middleware/errorHandlerMiddleware')



// db
const connectDbB = require('./config/connect')


// routes
 const authRouter = require('./routes/authRouter')
 const productRouter = require('./routes/productRoute')
const cateRouter = require('./routes/cateRouter')
const brandRouter = require('./routes/brandRouter')
const colorRouter = require('./routes/colorRouter')
const reviewRouter = require('./routes/reviewRouter')
const orderRouter = require('./routes/orderRouter')
const userRouter = require('./routes/userRouter')
const couponRouter = require('./routes/coupRouter')
const Order = require('./model/Order')



const stripe = new Stripe(process.env.STRIPE_API_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_80615289a1943dbc47974dd8c8a25db04e6e8d2d332362e3394ec5b8cb24f3ef";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('event');
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0]
    const totalAmount = session.amount_total
    const currency = session.currency
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
      paymentStatus,
      paymentMethod,
      totalPrice: totalAmount/100,
      currency
    }, 
    {
      new: true,
      runValidators: true
    }
    )

    console.log(order);

  }
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/category', cateRouter)
app.use('/api/v1/brand', brandRouter)
app.use('/api/v1/color', colorRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/coupon', couponRouter)

// stripe integration




// app.listen(4242, () => console.log('Running on port 4242'));


app.use(notFoundErrorMiddleware)
app.use(errohMiddlewareHandler)


const port = process.env.PORT || 5000

const start = async() => {
    try {
      await connectDbB(process.env.MONGO_URI)
      app.listen(port, () => {
        console.log(`app is up and running on port ${port}.....`)
      })  
    } catch (error) {
        console.log('unable to connect to database')
        
    }
}

start()