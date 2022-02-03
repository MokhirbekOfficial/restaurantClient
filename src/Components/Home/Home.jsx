import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [res, setRes] = useState();
  const [foods, setFoods] = useState();
  const [order, setOrder] = useState([]);
  const [cost, setCost] = useState();
  const [orderFood, setOrderFood] = useState([]);
  const [orderResId, setOrderResId] = useState([]);
  useEffect(() => {
    fetch("https://resback.herokuapp.com/")
      .then((data) => data.json())
      .then((m) => setRes(m));
  }, []);
  const actBtn = useRef(null);
  const orderAct = useRef(null);
  const resultModal = useRef(null);
  const getId = useRef(null);
  const register = useRef(null);
  const userName = useRef(null);
  const location = useRef(null);
  const phone = useRef(null);

  function modalActive(evt) {
    actBtn.current.classList.add("modalactive");
    let id = evt.currentTarget.getAttribute("data");
    setOrderResId(id);
    let objects = {
      res_id: id,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objects),
    };
    fetch("https://resback.herokuapp.com/foods", requestOptions)
      .then((data) => data.json())
      .then((m) => {
        setFoods(m);
      });
  }
  let orders2 = [];

  function removeModal(evt) {
    actBtn.current.classList.remove("modalactive");
    orderAct.current.classList.remove("orderactive");
  }

  function orderActive(evt) {
    orderAct.current.classList.add("orderactive");
    let orders = evt.currentTarget.getAttribute("data");
    foods.forEach((item) => {
      if (item.food_id === orders) {
        orders2.push(item);
      }
    });
  }
  function resultAct(evt) {
    let orderedFoods = [];
    let sum = 0;
    setOrder(orders2);
    orders2.forEach((item) => {
      sum = sum + Number(item.food_cost);
      orderedFoods.push(item.food_name);
    });
    setCost(sum);
    setOrderFood(orderedFoods);
    resultModal.current.classList.add("result_modal");
  }

  function remResult(evt) {
    resultModal.current.classList.remove("result_modal");
  }
  function actRegister(evt) {
    register.current.classList.add("actregister");
  }
  function remRegister(evt) {
    register.current.classList.remove("actregister");
  }
  function formSubmit(evt) {
    evt.preventDefault();
    let newCounter = [];
    orderFood.forEach((item) => {
      if (!newCounter.includes(item)) {
        newCounter.push(item);
      }
    });
    let newFoodCount = [];
    for (let i = 0; i < newCounter.length; i++) {
      let foodCount = 0;
      for (let j = 0; j < orderFood.length; j++) {
        if (newCounter[i] === orderFood[j]) {
          foodCount++;
        }
      }
      newFoodCount.push(foodCount);
    }
    let currentTime = new Date();
    let year = new Date(currentTime).getFullYear();
    let month = String(new Date(currentTime).getMonth() + 1).padStart(2, "0");
    let day = String(new Date(currentTime).getDate()).padStart(2, "0");
    let hour = String(new Date(currentTime).getHours()).padStart(2, "0");
    let min = String(new Date(currentTime).getMinutes()).padStart(2, "0");

    let date = year + "/" + month + "/" + day + "  " + hour + ":" + min;
    let desArr = [];
    for (let i = 0; i < newCounter.length; i++) {
      desArr.push(newCounter[i]);
      desArr.push(newFoodCount[i]);
    }
    let description = desArr.toString();
    let obj = {
      order_res_id: orderResId,
      owner_name: userName.current.value,
      owner_tel: phone.current.value,
      owner_location: location.current.value,
      order_time: date,
      order_cost: cost,
      order_discription: description,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    };
    fetch("https://resback.herokuapp.com/neworder", requestOptions)
      .then((data) => data.json())
      .then((m) => {
        if (m === "ok") {
          alert("Successfully send");
        } else {
          alert("Something went wrong!");
        }
      });
    register.current.classList.remove("actregister");
    resultModal.current.classList.remove("result_modal");
    userName.current.value = null;
    phone.current.value = null;
    location.current.value = null;
  }
  return (
    <>
      <section className="home">
        <div className="navbar">
          <span>Food delevery</span>
        </div>
        <div className="container">
          <div className="homeContent">
            <div className="navbox">
              <ul className="TipList">
                <Link to="/" className="tipListitems">
                  <li className="tipListitems nav_active">Fast foods</li>
                </Link>
                <Link to="/medium" className="tipListitems">
                  <li className="tipListitems ">National foods</li>
                </Link>
              </ul>
            </div>
            <div className="rooms">
              <ul className="_room">
                {res &&
                  res.map((row) => (
                    <li
                      className="treeple"
                      ref={getId}
                      key={row.res_id}
                      data={row.res_id}
                      onClick={modalActive}
                    >
                      <div className="items item_1">
                        <img src={row.res_img} alt="" />
                      </div>
                      <span className="link_1">{row.res_name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="modal_foods " ref={actBtn}>
          <div className="container">
            <div className="header">
              <h1>
                <span>Menu</span>
              </h1>
              <i className="fas fa-home" onClick={removeModal}></i>
            </div>
            <ul>
              {foods &&
                foods.map((row) => (
                  <li className="items" key={row.food_id}>
                    <img className="foodimg" src={row.food_img} alt="foto" />
                    <div className="prices">
                      <h2>{row.food_name}</h2>
                      <span>
                        {row.food_cost} so'm
                        <button
                          className="orderBtn"
                          onClick={orderActive}
                          data={row.food_id}
                        >
                          +
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="orders" ref={orderAct} onClick={resultAct}>
              <i className="fas fa-cart-arrow-down"></i>
            </div>
            <div className="orderModal" ref={resultModal}>
              <div className="allOrders">
                <h1 className="selected">
                  SELECTED <i className="fas fa-times" onClick={remResult}></i>
                </h1>
                <ul className="orderList">
                  {order &&
                    order.map((row, index) => (
                      <li className="selected_item" key={index}>
                        <h1>{row.food_name}</h1>
                        <span>{row.food_cost}</span>
                      </li>
                    ))}
                </ul>
                <div className="result">
                  <span>
                    Total: <p>{cost}</p>
                  </span>
                  <button onClick={actRegister}>Confirm</button>
                </div>
                <div className="register" ref={register}>
                  <h1>
                    Enter informations
                    <i className="fas fa-times" onClick={remRegister}></i>
                  </h1>
                  <form onSubmit={formSubmit}>
                    <input
                      type="text"
                      placeholder="Name"
                      ref={userName}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Adress"
                      ref={location}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Phone number"
                      ref={phone}
                      required
                    />
                    <button>Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
