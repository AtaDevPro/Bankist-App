"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  persianName: "جوناس اشمیتمن",
  movements: [200, 455, -306, 25000, -600, -130, 79, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  persianName: "جسیکا دیویس",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  persianName: "استیون توماس ویلیام",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "KRW",
  locale: "ko-KR",
};

const account4 = {
  owner: "Sarah Smith",
  persianName: "سارا اسمیت",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const account5 = {
  owner: "Ata Asadzadeh",
  persianName: "عطا اسدزاده",
  movements: [700, 3000, 8500, 500, -75],
  interestRate: 0.8,
  pin: 5555,

  movementsDates: [
    "2025-01-25T14:18:46.235Z",
    "2025-02-05T16:33:06.386Z",
    "2025-04-10T14:43:26.374Z",
    "2025-06-25T18:49:59.371Z",
    "2025-07-26T12:01:20.894Z",
  ],
  currency: "IRR",
  locale: "fa-IR",
};


const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const formatMovmentDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date1 - date2));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "امروز";
  if (daysPassed === 1) return "دیروز";
  if (daysPassed <= 7) return `${daysPassed} روز گذشته`;
  else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// برای نشان دادن واریزی ها و برداشت ها در صفحه
const displayMovments = function (acc, sort = false) {
  // برای پاک کردن مقدار اولیه باقی مانده در اچ تی ام ال (Html Hardcore)
  containerMovements.innerHTML = "";

  // اینجا میایم از آرایه موومنت مپ میگیریم که توش موو و ایندکسش مشخص باشه بعد اینارو توی یه ابجکت میریزیم که موو که همون مقدار پولیه که داره ردوبدل میشه بریزه تو موومنت و تاریخ هایی که توی آرایه موومنت دیت هستند توی همون ایندکسی که مقدار رد و بدل میشه بریزند توی موومنت دیت
  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  // بعد اینجا میگیم که اگه سورت ترو بود روی متغیر کامبایندموودیت این سورت رو اجرا کن
  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (obg, i) {
    const { movement, movementDate } = obg;
    const type = movement > 0 ? "deposit" : "withdrawal";
    const typeText = type === "deposit" ? "واریز" : "انتقال";

    const date = new Date(movementDate);

    const displayDate = formatMovmentDate(date, acc.locale);

    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${typeText}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
        `;

    // اضافه کردن کد های جاوااسکریپت به اچ تی ام ال
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// نشان دادن موجودی کل
const calcDisplayMovments = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// نشان دادن واریزی ، برداشتی و سود
const calcDisplaySummary = function (acc) {
  const incoms = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incoms, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// ساختن یوزرنیم از روی اسم
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

// آپدیت کردن صفحه
const updateUI = function (acc) {
  // نمایش تاریخچه واریزی ها
  displayMovments(acc);

  // نمایش موجودی کل
  calcDisplayMovments(acc);

  // نمایش واریزی، برداشتی، سود
  calcDisplaySummary(acc);
};

// تایمر
let time;
const startLogOutTimer = function () {
  // زمان تایمر
  time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    // شرط تموم شدن تایم
    if (time === 0) {
      // پاک کردن تایمر
      clearInterval(timer);

      // پیام خوش آمدگویی
      labelWelcome.textContent = "برای شروع وارد شوید";

      // مخفی کردن صفحه نمایش
      containerApp.style.opacity = 0;
    }
    time--;
  };

  // setInterval
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

// ورود کاربر
btnLogin.addEventListener("click", function (e) {
  // حذف رفتار پیش فرض مرورگر
  e.preventDefault();

  // اینجا میگیم که اگه اطالاعاتی که کاربر میده با یکی از اطلاعات اکانت موجود ما در دیتابیس همخونی داشته باشه برو کل اون آرایه رو بریز توی کارنت اکانت
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // اینجا هم میگیم که اگه پینی که کاربر وارد میکنه با پینی که توی آرایه هستش یکی باشه کارای زیر رو بکن
  if (currentAccount?.pin === +inputLoginPin.value) {
    // نمایش صفحه و پیام خوش آمد گویی
    labelWelcome.textContent = `خوش اومدی، ${
      currentAccount.persianName.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // حدف اطلاعات یوزر و رمز در فورم
    inputLoginUsername.value = inputLoginPin.value = "";
    // برای برداشتن فوکوس از دکمه رمزه
    inputLoginPin.blur();

    // نشان دادن تاریخ در هنگام ورود
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // اگه وارد اکانت دیگه ای شدیم تایمر قبلی حذف بشه
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // آپدیت صفحه
    updateUI(currentAccount);
  }
});

// انتقال پول
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;

  // این باعث میشه اگه اسمی که کاربر وارد میکنه با یوزرنیم یکی از اکانت ها برابر باشه کل اون آرایه رو میریزه تو متغیر پایین
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // اضافه کردن تاریخ
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    // آپدیت صفحه
    updateUI(currentAccount);

    // ریست کردن تایمر برای اینکه اگه پول انتقال داد تایم ریست بشه
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//  دکمه گرفتن وام
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov * 0.1 >= amount)
  ) {
    setTimeout(function () {
      // اضافه کردن وام به لیست
      currentAccount.movements.push(amount);

      // اضافه کردن تاریخ
      currentAccount.movementsDates.push(new Date());

      // uptade UI
      updateUI(currentAccount);

      // ریست کردن تایمر برای اینکه اگه وام گرفت تایم ریست بشه
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2000);
  } else if (currentAccount.movements.some((mov) => mov * 0.1 < amount)) {
    alert("وامی که میخوای زیاده، فعلا نمیتونی این مقدار وام درخواست کنی 😅");
  }
  inputLoanAmount.value = "";
});

// دکمه حذف حساب کاربری
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // پیدا کردن ایندکس اکانتی که یوزرنیمش با یوزرنیمی که وارد کردیم یکیه
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // حذف اکانت
    accounts.splice(index, 1);

    // مخفی کردن ظاهر سایت
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// دکمه مرتب کردن (sort)
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
});
