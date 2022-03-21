// localStorage.setItem("match", 0)

window.onload = () => {
  var searchProduct = document.getElementById("searchBox");
  // var countProduct = document.querySelectorAll('div[id=countProduct]')
  var count = document.getElementById("count");
  var key = document.getElementById("key");
  var sortAsc = document.getElementById("sort-asc");
  var sortDesc = document.getElementById("sort-desc");
  searchProduct.onchange = () => {
    var api = "/search/match?key=" + searchProduct.value;
    fetch(api, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        localStorage.setItem("match", json);
      });
    localStorage.setItem("count", searchProduct.value);

    console.log(searchProduct.value);
    window.history.pushState(
      {},
      "",
      "/search/global?key=" + searchProduct.value
    );

    window.location.reload();
  };

  if (count != null) {
    count.innerHTML = localStorage.getItem("match");

    key.innerHTML = "'" + localStorage.getItem("count") + "'";
    // sort price
    sortAsc.onclick = () => {
      window.history.pushState(
        {},
        "",
        "/search/global?key=" + localStorage.getItem("count") + "&sort=asc"
      );
      window.location.reload();
    };
    sortDesc.onclick = () => {
      window.history.pushState(
        {},
        "",
        "/search/global?key=" + localStorage.getItem("count") + "&sort=desc"
      );
      window.location.reload();
    };
    const buyBtn = document.querySelectorAll(".buy-btn");
    const addBtn = document.querySelectorAll(".add-btn");
    buyBtn.forEach((buyBtnitem) => {
      buyBtnitem.onsubmit = function (e) {
        e.preventDefault();
        const accountclick = document.querySelector("header .account");
        fetch("/account/login/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status == "true") {
              fetch(
                "/" +
                  buyBtnitem.id +
                  "/checkout?itemID=" +
                  buyBtnitem.getAttribute("data"),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              window.location = "/checkout";
            } else {
              accountclick.click();
              return false;
            }
          });
      };
    });
    addBtn.forEach((addBtnitem) => {
      addBtnitem.onsubmit = function (e) {
        e.preventDefault();
        const accountclick = document.querySelector("header .account");
        fetch("/account/login/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status == "true") {
              fetch(
                "/" +
                  addBtnitem.id +
                  "/checkout?itemID=" +
                  addBtnitem.getAttribute("data"),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              // window.location ="/checkout";
            } else {
              accountclick.click();
              return false;
            }
          });
      };
    });
  } else {
    var temp = "true";
  }
};
