/*start prevent default event form*/
const Forms = document.querySelectorAll(".account-modal-container form");
const submitBtns = document.querySelectorAll(
  ".account-modal-container input[type ='submit'] "
);

/*
submitBtns.forEach((item) => {
	item.addEventListener("click", (e) => {
		e.preventDefault();
	});
});
*/

Forms.forEach((item) => {
  item.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});
/*end preven default event form */

/*start solve account icon */
const loginForm = document.querySelector(".account-modal .login-form");
const signUpForm = document.querySelector(".account-modal .signUp-form");
const signUpFormConfirm = document.querySelector(
  ".account-modal .signUp-form-confirm"
);
const findAccountForm = document.querySelector(
  ".account-modal .find-account-form"
);
const findAccountFormChange = document.querySelector(
  ".account-modal .find-account-form-change"
);

const accountIcon = document.querySelector("header .account");
const accountOptions = document.querySelector("header .account__options");
const accountModal = document.querySelector(".account-modal-container");
const signOutBtn = document.querySelector("header .account #signOut");
signOutBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  signOut();
  fetch("/account/signout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
});
function mouseOver() {
  accountOptions.style.display = "block";
}
function logIn(name) {
  const userName = document.querySelector(
    "header .account__options li:first-child h2"
  );
  let checkoutIco = document.querySelector(".header__utility .checkoutIco");
  checkoutIco.setAttribute("href", "/checkout");
  userName.innerText = name;
  accountIcon.addEventListener("mouseover", mouseOver);
  accountIcon.addEventListener("mouseout", (e) => {
    accountOptions.style.display = "none";
  });
  accountIcon.removeEventListener("click", openModal);
}

function openModal() {
  accountModal.style.display = "flex";
  loginForm.style.display = "block";
  signUpForm.style.display = "none";
  findAccountForm.style.display = "none";
  resetModal();
}
function signOut() {
  accountIcon.addEventListener("click", openModal);
  accountIcon.removeEventListener("mouseover", mouseOver);
}

fetch("/account/login/user", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((res) => {
    if (res.status == "true") {
      logIn(res.name);
    } else {
      signOut();
    }
  });
/* end solve icon account */

/*start function reset modal */
function resetModal() {
  var errorMessages = document.querySelectorAll(
    ".account-modal-container .error-message"
  );
  for (var message of errorMessages) {
    message.innerText = "";
    message.parentElement
      .querySelector(".form-row")
      .classList.remove("invalid");
  }
  const inputPassword = document.querySelectorAll(
    ".account-modal-container input[name *='assword']"
  );
  for (var input of inputPassword) {
    input.setAttribute("type", "password");
    input.parentElement
      .querySelector(".cover-icon")
      .setAttribute("class", "fas fa-eye-slash cover-icon");
  }
}
/*end function reset modal  */

/*start close account form */
const accountFormCloseBtns = document.querySelectorAll(
  ".account-modal-container .modal-close-btn"
);
accountFormCloseBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    accountModal.style.display = "none";
    e.currentTarget.parentNode.reset();
  });
});
/* end close account form */

/* cover password */
const coverIcon = document.querySelectorAll(
  ".account-modal-container .cover-icon"
);
function showPassWord(e) {
  const clickedIcon = e.currentTarget;
  const clickedInput = clickedIcon.parentNode.querySelector("input");
  if (clickedIcon.getAttribute("class") == "fas fa-eye-slash cover-icon") {
    clickedIcon.setAttribute("class", "fas fa-eye cover-icon");
    clickedInput.setAttribute("type", "text");
  } else {
    clickedIcon.setAttribute("class", "fas fa-eye-slash cover-icon");
    clickedInput.setAttribute("type", "password");
  }
}
for (let icon of coverIcon) {
  icon.addEventListener("click", showPassWord);
}
/*cover password*/

/* start forward all form */

const forwardLoginBtns = document.querySelectorAll(
  ".account-modal .forward-login"
);
const forwardSignUpBtn = document.querySelector(
  ".account-modal .forward-SignUp"
);
const forwardFindAccountBtn = document.querySelector(
  ".account-modal .forward-FindAccount"
);

forwardLoginBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentForm = e.target.parentNode;
    currentForm.reset();
    currentForm.style.display = "none";
    loginForm.style.display = "block";
    resetModal();
  });
});
forwardSignUpBtn.addEventListener("click", (e) => {
  currentForm = e.target.parentNode;
  currentForm.reset();
  currentForm.style.display = "none";
  signUpForm.style.display = "block";
  resetModal();
});
forwardFindAccountBtn.addEventListener("click", (e) => {
  currentForm = e.target.parentNode;
  currentForm.reset();
  currentForm.style.display = "none";
  findAccountForm.style.display = "block";
  resetModal();
});

/* start solve error from backend */
function errSever(input, message) {
  input.value = "";
  input.parentElement.classList.add("invalid");
  input.parentElement.parentElement.querySelector(".error-message").innerText =
    message;
}
/* end solve error from backend */

/* end forward all form */

/*start solve signUp form*/

//start solve submit signUp form //
function signUpSubmit(data) {
  fetch("/account/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "true") {
        signUpForm.reset();
        signUpForm.style.display = "none";
        signUpFormConfirm.style.display = "block";

        //start solve signUp confirm
        Validator({
          form: ".signUp-form-confirm",
          errorSelector: ".error-message",
          rules: [Validator.isRequired("#signUp-code")],
          onSubmit: function (code) {
            fetch("/account/register/confirm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...data,
                ...code,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.status === "true") {
                  signUpFormConfirm.style.display = "none";
                  signUpFormConfirm.reset();
                  loginForm.style.display = "block";
                  resetModal();
                } else {
                  input = document.querySelector(
                    ".signUp-form-confirm #signUp-code"
                  );
                  errSever(input, res.message);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          },
        });
        //end solve signUp confirm
      } else {
        input = document.querySelector(".signUp-form #signUp-email");
        errSever(input, res.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
//end solve submit signUp form //
//start check valid sign up form//
Validator({
  form: ".signUp-form",
  errorSelector: ".error-message",
  rules: [
    Validator.isRequired("#signUp-fullname"),
    Validator.isRequired("#signUp-email"),
    Validator.isEmail("#signUp-email"),
    Validator.isRequired("#signUp-password"),
    Validator.isPhone("#signUp-phone"),
    Validator.isMinLength("#signUp-password", 6),
    Validator.isRequired("#signUp-confirmPassword"),
    Validator.isConfirm("#signUp-confirmPassword", function () {
      return document.querySelector(".signUp-form #signUp-password").value;
    }),
  ],
  onSubmit: function (data) {
    signUpSubmit(data);
  },
});
//start check valid sign up form

/*end solve signUp form*/

/*star solve login form*/
//start solve submit login form //
function loginSubmit(data) {
  fetch("/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "true") {
        document.querySelector(".login-form .modal-close-btn").click();
        logIn(res.name);
      } else {
        if (res.err === "email") {
          input = document.querySelector(".login-form #login-mail");
          errSever(input, res.message);
        } else {
          input = document.querySelector(".login-form #login-password");
          errSever(input, res.message);
        }
      }
    })
    .catch((res) => {});
}
//end solve submit login form//
Validator({
  form: ".login-form",
  errorSelector: ".error-message",
  rules: [
    Validator.isEmail("#login-mail"),
    Validator.isMinLength("#login-password", 6),
  ],
  onSubmit: function (data) {
    loginSubmit(data);
  },
});
/*end solve login form*/

/*start solve recovery form */
function checkEmail(value) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(value) ? undefined : "Trường này phải là email";
}
var getCodeBtn = document.querySelector(".find-account-form .get-code-btn");
var inputEmail = document.querySelector(".find-account-form #recovery-email");
var recoveryMessageError =
  inputEmail.parentElement.parentElement.querySelector(".error-message");
/* start get recovery code */
getCodeBtn.addEventListener("click", (e) => {
  var errorMessage = checkEmail(inputEmail.value);
  e.preventDefault();
  if (errorMessage) {
    recoveryMessageError.innerText = errorMessage;
  } else {
    fetch("/account/recovery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: inputEmail.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res == "false") {
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
/* end get recovery code */
/*start sovle recoveryform submit */

function recoverySubmit(recoveryData) {
  fetch("/account/recovery/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recoveryData),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status == "true") {
        {
          findAccountForm.reset();
          findAccountForm.style.display = "none";
          findAccountFormChange.style.display = "block";
          resetModal();
        }
      } else {
        input = document.querySelector(".find-account-form #recovery-code");
        errSever(input, res.message);
      }
    });
}

/*end sovle recoveryform submit */
Validator({
  form: ".find-account-form",
  errorSelector: ".error-message",
  rules: [
    Validator.isEmail("#recovery-email"),
    Validator.isRequired("#recovery-code"),
  ],
  onSubmit: function (recoveryData) {
    recoverySubmit(recoveryData);
  },
});

function ChangePassSubmit(password) {
  fetch("/account/recovery/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status == "true") {
        findAccountFormChange.style.display = "none";
        findAccountFormChange.reset();
        resetModal();
        loginForm.style.display = "block";
      } else {
      }
    });
}

Validator({
  form: ".find-account-form-change",
  errorSelector: ".error-message",
  rules: [
    Validator.isRequired("#recovery-confirmPassword"),
    Validator.isMinLength("#recovery-password", 6),
    Validator.isRequired("#recovery-password"),
    Validator.isConfirm("#recovery-confirmPassword", function () {
      return document.querySelector("#recovery-password").value;
    }),
  ],
  onSubmit: function (password) {
    ChangePassSubmit(password);
  },
});
/*end solve recovery form */

const icons = document.querySelectorAll("header .icon > i");
icons.forEach((icon) => {
  icon.addEventListener("mouseenter", function (event) {
    event.target.classList.toggle("fas");
  });
  icon.addEventListener("mouseleave", function (event) {
    event.target.classList.toggle("fas");
  });
});

const toast = document.getElementById("toast");
function opentoast(message) {
  toast.innerHTML = `
  <div class="toast">
      <div class="toast__icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="toast__body"> 
        <h3 class="toast__title">Thông Báo</h3>
        <p class="toast__msg">${message}</p>
      </div>
      </div>
      `;
}
function checkoutIco() {
  let checkoutIco = document.querySelector(".header__utility .checkoutIco");
  let accountclick = document.querySelector("header .account");
  fetch("/account/login/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status != "true") {
        {
          accountclick.click();
          return false;
        }
      }
    });
}
