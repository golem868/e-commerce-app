import React from "react";
import logo from "./logo.svg";
import "./App.css";
// Global helper function
const objectFilter = (obj, fn) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v], i) => fn(v, k, i))
  );
};
// Analogous data from API call
const PRODUCTS = {
  brocoli: {
    key: "brocoli",
    name: "Brocoli",
    imageURL:
      "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/broccoli.jpg",
    keywords: ["vegetable", "diet", "food", "fresh", "green"],
    price: 4,
  },
  grapes: {
    name: "Grapes",
    key: "grapes",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/grape.jpg",
    keywords: ["food", "fresh", "fruit", "green"],
    price: 5,
  },
  strawberries: {
    name: "Strawberries",
    key: "strawberries",
    imageURL:
      "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/strawberry.jpg",
    keywords: ["food", "fresh", "fruit", "breakfast"],
    price: 6,
  },
  cheese: {
    name: "Cheese",
    key: "cheese",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/cheese2.png",
    keywords: ["dairy", "breakfast", "food"],
    price: 5,
  },
  yogurt: {
    name: "Yogurt",
    key: "yogurt",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/yoghurt.png",
    keywords: ["dairy", "food", "breakfast"],
    price: 3,
  },
  toothpaste: {
    name: "Toothpaste",
    key: "toothpaste",
    imageURL:
      "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/toothpaste.png",
    keywords: ["dental", "hygiene"],
    price: 10,
  },
  shampoo: {
    name: "Shampoo",
    key: "shampoo",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/shampoo.png",
    keywords: ["hair", "hygiene"],
    price: 15,
  },
  soap: {
    name: "Soap",
    key: "soap",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/soap.jpg",
    keywords: ["body", "hygiene"],
    price: 2,
  },
  wine: {
    name: "Wine",
    key: "wine",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/wine.png",
    keywords: ["alcohol", "bar", "beverage"],
    price: 12,
  },
  napkins: {
    name: "Napkins",
    key: "napkins",
    imageURL: "https://cdn.jsdelivr.net/gh/josecarlosgt/infosys280/napkin.png",
    keywords: ["bar", "table"],
    price: 4,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [], // {item:{PRODUCTS_item},quantity}
      searchKey: null,
    };
  }
  handleSearch(keyStr) {
    if (keyStr) {
      // validate keys
      // check for only whitespace
      keyStr = keyStr.trim();
    }
    this.setState({
      searchKey: keyStr,
    });
  }
  generateProduct_Json() {
    const key = this.state.searchKey;
    // check for empty string
    if (key) {
      // Only accept one complete word search
      const searchResultObject = objectFilter(PRODUCTS, (v) => {
        return v.keywords.includes(key);
      });
      return searchResultObject;
    } else {
      return PRODUCTS;
    }
  }
  // Only handle one item per time
  addToCart(product_key) {
    const product = PRODUCTS[product_key];
    const currentCart = this.state.cart;
    // Function object
    const itemInCart = (cart_list, product) => {
      for (const [index, obj] of cart_list.entries()) {
        if (obj.item === product) return index;
      }
      return null;
    };
    const itemIndex = itemInCart(currentCart, product);
    // handle index 0
    if (itemIndex === null) {
      currentCart.push({ item: product, quantity: 1 });
      this.setState({
        cart: currentCart,
      });
    } else {
      currentCart[itemIndex].quantity += 1;
      this.setState({
        cart: currentCart,
      });
    }
  }
  handleCartItem(cart_list) {
    this.setState({
      cart: cart_list,
    });
  }
  render() {
    return (
      <div className="App container">
        <header className="jumbotron text-left d-flex">
          <img src={logo} alt="logo" className="col-2 img-fluid" id="logo" />
          <Cart
            item_list={this.state.cart}
            onChange={(cart_list) => this.handleCartItem(cart_list)}
          />
          <SearchArea onClick={(keyStr) => this.handleSearch(keyStr)} />
        </header>

        <main>
          <Home
            product_obj={this.generateProduct_Json()}
            pictureOnClick={(product_key) => this.addToCart(product_key)}
          />
        </main>

        <footer>
          <small>&copy; 2020 No copyright</small>
        </footer>
      </div>
    );
  }
}
class Home extends React.Component {
  handleClick(e) {
    const product_key = e.target.id;
    return this.props.pictureOnClick(product_key);
  }
  showProducts(product_obj) {
    let content = [];
    if (Object.keys(product_obj).length === 0) {
      return (
        <li key="li_no_match" className="col-11">
          No products match this query
        </li>
      );
    }
    for (let product_key in product_obj) {
      const current_product = product_obj[product_key];
      //key,name,imageURL,keywords,price
      content.push(
        <li
          key={"li_" + current_product.name}
          className="col-xs-11 col-sm-6 col-md-4 col-xl-3"
        >
          <figure className="figure">
            <img
              src={current_product.imageURL}
              alt={current_product.name}
              id={current_product.key}
              className="figure-img img-fluid pointer"
              onClick={(e) => this.handleClick(e)}
            />
            <figcaption className="figure-caption">
              {current_product.name} ${current_product.price}
            </figcaption>
          </figure>
        </li>
      );
    }
    return content;
  }
  render() {
    return (
      <ul className="row p-0 align-items-end justify-content-start">
        {this.showProducts(this.props.product_obj)}
      </ul>
    );
  }
}
class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // for dropdown cart table
      on: false,
      // for sortable table
      sortDirection: "asc", // 'asc' and ' desc'
      selectedHeaderIndex: 0,
    };
    this.ascSort = this.ascSort.bind(this);
    this.descSort = this.descSort.bind(this);
  }
  getColumnValue(row1, row2, headerIndex) {
    switch (headerIndex) {
      case 1:
        return [row1.item.name.localeCompare(row2.item.name), 0];
      case 2:
        return [row1.item.price, row2.item.price];
      case 3:
        return [row1.quantity, row2.quantity];
      default:
        return [0, 0];
    }
  }
  ascSort(row1, row2) {
    const headerIndex = this.state.selectedHeaderIndex;
    const [val1, val2] = this.getColumnValue(row1, row2, headerIndex);
    return val1 - val2;
  }
  descSort(row1, row2) {
    const headerIndex = this.state.selectedHeaderIndex;
    const [val1, val2] = this.getColumnValue(row1, row2, headerIndex);
    return val2 - val1;
  }
  flipSortDirection() {
    return this.state.sortDirection === "asc" ? "desc" : "asc";
  }
  sortByHeader(i) {
    let sortDir = this.state.sortDirection;
    let headerIndex = this.state.selectedHeaderIndex;
    if (headerIndex === i) {
      sortDir = this.flipSortDirection();
    } else {
      sortDir = "asc";
      headerIndex = i;
    }
    this.setState({
      sortDirection: sortDir,
      selectedHeaderIndex: headerIndex,
    });
  }
  calculateTotalPrice() {
    const total = this.props.item_list.reduce(
      (acc, val) => acc + val.item.price * val.quantity,
      0
    );
    return total;
  }
  handleCartChange(counter, isAdd) {
    let item_list = this.props.item_list;
    const target_item_num = item_list[counter].quantity;
    if (isAdd) {
      item_list[counter].quantity += 1;
    } else if (target_item_num === 1) {
      item_list.splice(counter, 1);
    } else {
      item_list[counter].quantity -= 1;
    }
    return this.props.onChange(item_list);
  }
  showCartItem_asTable() {
    const cart = this.props.item_list;
    const tableHead = [
      <thead key="tHeader">
        <tr key="thead">
          <th scope="col" key="thead-0">
            #
          </th>
          <th scope="col" key="thead-1" onClick={() => this.sortByHeader(1)}>
            Product
          </th>
          <th scope="col" key="thead-2" onClick={() => this.sortByHeader(2)}>
            Price
          </th>
          <th scope="col" key="thead-3" onClick={() => this.sortByHeader(3)}>
            Quantity
          </th>
        </tr>
      </thead>,
    ];
    if (cart.length === 0) {
      return (
        <div key="no_item_in_cart" className="alert alert-info">
          No products in Cart
        </div>
      );
    }
    let content = [];
    // determine comparator function
    const cmp =
      this.state.sortDirection === "asc" ? this.ascSort : this.descSort;
    cart.sort(cmp);
    for (const [counter, obj] of cart.entries()) {
      const current_product = obj.item;
      const quantity = obj.quantity;
      //key,name,imageURL,keywords,price
      content.push(
        <tr key={"tbody-" + counter}>
          <th key={"tbody-" + counter + "-0"} scope="row">
            {counter + 1}
          </th>
          <td key={"tbody-" + counter + "-1"}>{current_product.name}</td>
          <td key={"tbody-" + counter + "-2"}>${current_product.price}</td>
          <td key={"tbody-" + counter + "-3"}>
            {quantity}&nbsp;
            <button
              type="button"
              onClick={() => this.handleCartChange(counter, true)}
              className="btn btn-sm btn-link py-0"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => this.handleCartChange(counter, false)}
              className="btn btn-sm btn-link py-0"
            >
              -
            </button>
          </td>
        </tr>
      );
    }

    content.push(
      <tr key="tbody-last" className="table-secondary">
        <th key="tbody-last-0" scope="row">
          Total
        </th>
        <td key="tbody-last-1" colSpan="2">
          ${this.calculateTotalPrice()}
        </td>
        <td>
          <button type="button" className="btn btn-sm btn-link">
            CheckOut
          </button>
        </td>
      </tr>
    );

    let tableBody = <tbody key="tBody">{content}</tbody>;
    return (
      <table className="table table-light table-striped text-left">
        {tableHead}
        {tableBody}
      </table>
    );
  }
  showCartItem_asDropDown() {
    const itemCount = this.props.item_list.length;
    let divClass = "dropdown-content mt-1";
    const content = (
      <div>
        <button className="btn btn-info" onClick={() => this.toggleDropDown()}>
          Cart: {itemCount}
        </button>
        <div className={this.state.on ? divClass : divClass + " hide"}>
          {this.showCartItem_asTable()}
        </div>
      </div>
    );
    return content;
  }
  toggleDropDown() {
    this.setState({
      on: !this.state.on,
    });
  }
  render() {
    return this.showCartItem_asDropDown();
  }
}
class SearchArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }
  updateInputValue(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }
  searchProductKeyword(e = null) {
    if (e && e.key !== "Enter") {
      return;
    }
    const searchStr = this.state.inputValue.toLowerCase();
    return this.props.onClick(searchStr);
  }
  render() {
    return (
      <div className="ml-auto" id="searchArea">
        <div className="form-inline">
          <input
            className="form-control mr-1"
            placeholder="Search with keyword"
            type="text"
            id="searchBar"
            list="product_keyword_list"
            autoComplete="off"
            onChange={(e) => this.updateInputValue(e)}
            onKeyDown={(e) => this.searchProductKeyword(e)}
          />
          <datalist id="product_keyword_list">
            <option value="food" />
            <option value="breakfast" />
            <option value="beverage" />
          </datalist>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => this.searchProductKeyword()}
          >
            Search
          </button>
        </div>
      </div>
    );
  }
}
export default App;
