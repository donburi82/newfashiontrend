import { Web3Button } from '@web3modal/react'
import React from "react";
import './HomePage.css';
import cap from './cap.png';
import nb from './nb.png';
import logo from './logo.png'

function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "HKD",
    currencyDisplay: "code"
  });
}

function TopBar() {
  return (
    <header className="container top">
      <div className="col left top">
        <div className="thumbnail">
          <a href="./">
            <img src={logo} alt={"logo"} />
          </a>
        </div>
        <div className="detail">
          <div className="slogan">
            <a href="./">Have a byte of</a>
          </div>
          <div className="nft">NewFashionTrend</div>
        </div>
      </div>
    </header>
  );
}

function Header({ itemCount }) {
  return (
    <header className="container">
      <h1>Shopping Cart</h1>

      <ul className="breadcrumb">
        <li>Home</li>
        <li>Shopping Cart</li>
      </ul>

      <span className="count">{itemCount} items in the bag</span>
    </header>
  );
}

function ProductList({ products, onChangeProductQuantity, onRemoveProduct }) {
  return (
    <section className="container">
      <ul className="products">
        {products.map((product, index) => {
          return (
            <li className="row" key={index}>
              <div className="col left">
                <div className="thumbnail">
                  <a href="./">
                    <img src={product.image} alt={product.name} />
                  </a>
                </div>
                <div className="detail">
                  <div className="name">
                    <a href="./">{product.name}</a>
                  </div>
                  <div className="description">{product.description}</div>
                  <div className="price">{formatCurrency(product.price)}</div>
                </div>
              </div>

              <div className="col right">
                <div className="quantity">
                  <input
                    type="text"
                    className="quantity"
                    step="1"
                    value={product.quantity}
                    onChange={(event) => onChangeProductQuantity(index, event)}
                  />
                </div>

                <div className="remove">
                  <svg
                    onClick={() => onRemoveProduct(index)}
                    version="1.1"
                    className="close"
                    x="0px"
                    y="0px"
                    viewBox="0 0 60 60"
                    enableBackground="new 0 0 60 60"
                  >
                    <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
                  </svg>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Summary({
  subTotal,
  discount,
  delivery,
  onEnterPromoCode,
  checkPromoCode
}) {
  const total = subTotal - discount + delivery;

  return (
    <section className="container">
      <div className="promotion">
        <label htmlFor="promo-code">Have A Promo Code?</label>
        <input type="text" onChange={onEnterPromoCode} />
        <button type="button" onClick={checkPromoCode} />
      </div>

      <div className="summary">
        <ul>
          <li>
            Subtotal <span>{formatCurrency(subTotal)}</span>
          </li>
          {discount > 0 && (
            <li>
              Discount <span>{formatCurrency(discount)}</span>
            </li>
          )}
          <li>
            Delivery <span>{formatCurrency(delivery)}</span>
          </li>
          <li className="total">
            Order Total <span>{formatCurrency(total)}</span>
          </li>
        </ul>
      </div>

      <div className="checkout">
        <Web3Button />
        {/* <button type="button">Check Out</button> */}
      </div>
    </section>
  );
}

const PRODUCTS = [
  {
    image: nb,
    name: "NEW BALANCE 990v5 Core",
    description: "GRAY, 6",
    price: 1899.00,
    quantity: 1
  },
  {
    image: cap,
    name: "BLACK MUSEUM PARK BALL CAP",
    description: "",
    price: 925.59,
    quantity: 2
  }
];
const PROMOTIONS = [
  {
    code: "WELCOME",
    discount: "5%"
  }
];
const DELIVERY = 28;

function HomePage() {
  const CLONE_PRODUCTS = JSON.parse(JSON.stringify(PRODUCTS));
  const [products, setProducts] = React.useState(CLONE_PRODUCTS);
  const [promoCode, setPromoCode] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState(0);

  const itemCount = products.reduce((quantity, product) => {
    return quantity + +product.quantity;
  }, 0);
  const subTotal = products.reduce((total, product) => {
    return total + product.price * +product.quantity;
  }, 0);
  const discount = (subTotal * discountPercent) / 100;

  function onChangeProductQuantity(index, event) {
    const value = event.target.value;
    const valueInt = parseInt(value);
    const cloneProducts = [...products];

    // Minimum quantity is 1, maximum quantity is 100, can left blank to input easily
    if (value === "") {
      cloneProducts[index].quantity = value;
    } else if (valueInt > 0 && valueInt < 100) {
      cloneProducts[index].quantity = valueInt;
    }

    setProducts(cloneProducts);
  };

  function onRemoveProduct(i) {
    const filteredProduct = products.filter((product, index) => {
      return index !== i;
    });

    setProducts(filteredProduct);
  };

  function onEnterPromoCode(event) {
    setPromoCode(event.target.value);
  };

  function checkPromoCode() {
    for (var i = 0; i < PROMOTIONS.length; i++) {
      if (promoCode === PROMOTIONS[i].code) {
        setDiscountPercent(parseFloat(PROMOTIONS[i].discount.replace("%", "")));

        return;
      }
    }

    alert("Sorry, the Promotional code you entered is not valid!");
  };

  return (
    <div>
      <TopBar />
      <Header itemCount={itemCount} />

      {products.length > 0 ? (
        <div>
          <ProductList
            products={products}
            onChangeProductQuantity={onChangeProductQuantity}
            onRemoveProduct={onRemoveProduct}
          />

          <Summary
            subTotal={subTotal}
            discount={discount}
            delivery={DELIVERY}
            onEnterPromoCode={onEnterPromoCode}
            checkPromoCode={checkPromoCode}
          />
        </div>
      ) : (
        <div className="empty-product">
          <h3>There are no products in your cart.</h3>
          <button onClick={() => setProducts(PRODUCTS)}>Shopping now</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;