//コード(汚物)

let coins = 0;
let coins_per_click = 1;    //後に計算
let coins_per_second = 0;   //後に計算
let coins_earned = 0;
let clicks = 0;
let ascensions = 0;         //後に計算
let upgrades_level = {};

function isRealNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

if (localStorage.getItem("save_data")) {
  const save_data = JSON.parse(localStorage.getItem("save_data"))
  if (isRealNumber(save_data["coins"]) && save_data["coins"] >= 0) coins = save_data["coins"];
  if (isRealNumber(save_data["coins_earned"]) && save_data["coins_earned"] >= 0) coins_earned = save_data["coins_earned"];
  if (isRealNumber(save_data["clicks"]) && save_data["clicks"] >= 0) clicks = save_data["clicks"];
  if (save_data["upgrades_level"]) upgrades_level = save_data["upgrades_level"];
}

const suffixes = [
  "", "", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
  "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
  "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg",
  "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg",
  "Qag", "Uqag", "Dqag", "Tqag", "Qaqag", "Qiqag", "Sxqag", "Spqag", "Ocqag", "Noqag",
  "Qig", "Uqig", "Dqig", "Tqig", "Qaqig", "Qiqig", "Sxqig", "Spqig", "Ocqig", "Noqig",
]

let upgrades = {
  "cursor_I"  : {"title": "Cursor I"  , "sub": "More clicks!"        , "effect": "", "cost":          20, "mpc":     .5, "mps":       0},
  "finger"    : {"title": "Finger"    , "sub": "First auto click"    , "effect": "", "cost":         250, "mpc":      0, "mps":       3},
  "cursor_II" : {"title": "Cursor II" , "sub": "Golden!"             , "effect": "", "cost":        1500, "mpc":     15, "mps":       0},
  "hydropower": {"title": "Hydropower", "sub": "The power of water"  , "effect": "", "cost":        8000, "mpc":      0, "mps":      80},
  "pyropower" : {"title": "Pyropower" , "sub": "Fire!!!"             , "effect": "", "cost":       50000, "mpc":      0, "mps":     400},
  "cursor_III": {"title": "Cursor III", "sub": "Shiny emerald"       , "effect": "", "cost":      100000, "mpc":    750, "mps":       0},
  "solarpower": {"title": "Solarpower", "sub": "Massive solar panels", "effect": "", "cost":      600000, "mpc":      0, "mps":    4500},
  "windpower" : {"title": "Windpower" , "sub": '"Windy Landscape"'   , "effect": "", "cost":   3 * 10**6, "mpc":      0, "mps":   20000},
  "cursor_IV" : {"title": "Cursor IV" , "sub": "Blue Ruby? Sapphire?", "effect": "", "cost":   6 * 10**6, "mpc":  30000, "mps":       0},
  "nuclepower": {"title": "Nuclepower", "sub": "Modern conveniences" , "effect": "", "cost":  25 * 10**6, "mpc":      0, "mps":  150000},
};

for (const upgrade_name in upgrades) {
  let effect = ""; //エフェクトを自動設定
  if (upgrades[upgrade_name]["mpc"] != 0) {
    if (effect != "") effect += "<br>";
    effect += "coins/click +" + FormatNumber(upgrades[upgrade_name]["mpc"], false, 3);
  }
  if (upgrades[upgrade_name]["mps"] != 0) {
    if (effect != "") effect += "<br>";
    effect += "coins/sec +" + FormatNumber(upgrades[upgrade_name]["mps"], false, 3);
  }
  upgrades[upgrade_name]["effect"] = effect

  if (!upgrades_level[upgrade_name]) upgrades_level[upgrade_name] = {"level": 0, "ascensions": 0}; //upgrades_levelを自動設定

  upgrades[upgrade_name]["cost"] *= 1.12**(upgrades_level[upgrade_name]["level"] + upgrades_level[upgrade_name]["ascensions"] + 12.5 * upgrades_level[upgrade_name]["ascensions"] * (upgrades_level[upgrade_name]["ascensions"] + 3));
}

let achievements = {
  // 0: 解除済み?, 1: 条件, 2: title, 3: desc
  "1_coin"    : [false, () => (coins_earned >= 1)    , "First Step"     , "Earn 1 coin"           ],
  "1k_coins"  : [false, () => (coins_earned >= 10**3), "Tiny Rich"      , "Earn 1k coins"         ],
  "1M_coins"  : [false, () => (coins_earned >= 10**6), "Mega Bucks"     , "Earn 1M coins"         ],
  "100_clicks": [false, () => (clicks >= 100)        , "Tiny Tap"       , "Click button 100 times"],
  "500_clicks": [false, () => (clicks >= 500)        , "Getting Warm"   , "Click button 500 times"],
  "1k_clicks" : [false, () => (clicks >= 1000)       , "Clicking Frenzy", "Click button 1k times" ],
  "2k_clicks" : [false, () => (clicks >= 2000)       , "Button Master"  , "Click button 2k times" ],
};

//Star Buyer
//Galaxy Cash
//Cosmic King
//Infinite Rich
//Multiverse Cash

//Rapid Tapper     // 5,000 clicks
//Click Machine    // 10,000 clicks
//Legendary Clicker// 100,000 clicks

function FormatNumber(num, floor, dig) { //12,345,678
  let digits = Math.floor(Math.log10(num));  //7
  let index = Math.floor(digits / 3);        //2

  if (index >= 2) {
    return (Math.floor(num / 10**(digits - (dig - 1))) / 10**((dig - 1) - (digits - index * 3))) + suffixes[index]; //12.3 + "M"
  } else if (digits < 3 && !floor) {
    return Math.floor(num * 10) / 10;
  } else {
    return Math.floor(num).toLocaleString();
  }
}

const html_coins = document.getElementById("coins");
const html_coins_per_click = document.getElementById("coins_per_click");
const html_coins_per_second = document.getElementById("coins_per_second");
const html_stats_coins = document.getElementById("stats_coins");
const html_stats_coins_earned = document.getElementById("stats_coins_earned");
const html_stats_coins_per_click = document.getElementById("stats_coins_per_click");
const html_stats_coins_per_second = document.getElementById("stats_coins_per_second");
const html_stats_button_clicked = document.getElementById("stats_button_clicked");

const html_power_line = document.getElementById("power_line");

function money_button_clicked() { //ぼたんぽちっ！
  coins += coins_per_click;
  coins_earned += coins_per_click;
  clicks ++;
  html_coins.innerHTML = '<img src="images/emojis/coin.png" alt="$" class="emoji">' + FormatNumber(Math.floor(coins), true, 3);

  let a=`
  const img = document.createElement("img");
  img.src = "images/buttons/power.png";
  img.className = "power"
  img.style.left = "0";
  html_power_line.appendChild(img);

  let pos = 0;
  const move = setInterval(() => {
    pos += 1;
    img.style.left = pos + "vh";

    // 端まで行ったら削除
    if (pos / 100 * window.innerHeight > html_power_line.offsetWidth) {
      clearInterval(move);
      html_power_line.removeChild(img);
      }
    }, 20);
    `
};

function open_side_div(div_name) {
  const div = document.getElementById(div_name + "_div")
  const opened = (div.style.left == "30vh")
  document.querySelectorAll(".side_div").forEach(element => {
    element.style.left = "-25vh";
  });
  if (!opened) div.style.left = "30vh";
}

const html_upgrades_div = document.getElementById("upgrades_div");
const html_upgrade_button_div_template = document.getElementById("upgrade_button_div_template");

for (const upgrade_name in upgrades) { //あっぷぐれーどのUIつくる
  const upgrade_button_div = html_upgrade_button_div_template.content.querySelector(".upgrade_button_div").cloneNode(true);
  html_upgrades_div.appendChild(upgrade_button_div);
  upgrade_button_div.id = upgrade_name + "_upgrade_button_div"
  if (upgrade_name == "cursor_I" || upgrade_name == "finger" ) upgrade_button_div.style.display = "block";

  const upgrade_button = upgrade_button_div.querySelector(".upgrade_button");
  upgrade_button.onclick = () => upgrade(upgrade_name);
  upgrade_button.id = upgrade_name + "_upgrade_button";
  upgrade_button.dataset.effect = upgrades[upgrade_name]["effect"];

  const upgrade_button_text = upgrade_button.querySelector(".upgrade_button_text");
  upgrade_button_text.querySelector(".upgrade_image").src = `images/upgrades/${upgrade_name}.png`;
  upgrade_button_text.querySelector(".upgrade_image").id = upgrade_name + "_upgrade_image"
  upgrade_button_text.querySelector(".upgrade_name").id = upgrade_name + "_upgrade_name";
  upgrade_button_text.querySelector(".upgrade_cost").id = upgrade_name + "_upgrade_cost";
  upgrade_button_text.querySelector(".upgrade_level").id = upgrade_name + "_upgrade_level";

  const ascension_button = upgrade_button_div.querySelector(".ascension_button");
  ascension_button.onclick = () => ascension(upgrade_name);
  ascension_button.id = upgrade_name + "_ascension_button";

  const ascension_button_text = ascension_button.querySelector(".upgrade_button_text");
  ascension_button_text.querySelector(".upgrade_image").src = `images/upgrades/${upgrade_name}.png`;
  ascension_button_text.querySelector(".upgrade_level").id = upgrade_name + "_ascension_level";
}

for (const upgrade_name in upgrades) {
  document.getElementById(upgrade_name + "_upgrade_button").style.display = "block";
  document.getElementById(upgrade_name + "_ascension_button").style.display = "none";

  if (upgrades_level[upgrade_name]["level"] == upgrades_level[upgrade_name]["ascensions"] * 25 + 50) {
    document.getElementById(upgrade_name + "_upgrade_button").style.display = "none";
    document.getElementById(upgrade_name + "_ascension_button").style.display = "block";
  }

  if (upgrades_level[upgrade_name]["level"] != 0 || upgrades_level[upgrade_name]["ascensions"] != 0) {
  document.getElementById(upgrade_name + "_upgrade_button").dataset.title = upgrades[upgrade_name]["title"];
  document.getElementById(upgrade_name + "_upgrade_button").dataset.sub = upgrades[upgrade_name]["sub"];
  document.getElementById(upgrade_name + "_upgrade_name").textContent = upgrades[upgrade_name]["title"];
  document.getElementById(upgrade_name + "_upgrade_image").style.filter = "brightness(1)";
    const keys = Object.keys(upgrades);
    if (keys[keys.indexOf(upgrade_name) + 1])
      document.getElementById(keys[keys.indexOf(upgrade_name) + 1] + "_upgrade_button_div").style.display = "block";
    if (keys[keys.indexOf(upgrade_name) + 2])
      document.getElementById(keys[keys.indexOf(upgrade_name) + 2] + "_upgrade_button_div").style.display = "block";
  }
}


function upgrade(upgrade_name) { //あっぷぐれーど
  if (upgrades[upgrade_name]["cost"] <= coins) {
    if (upgrades_level[upgrade_name]["level"] == 0 && upgrades_level[upgrade_name]["ascensions"] == 0) {
      document.getElementById(upgrade_name + "_upgrade_button").dataset.title = upgrades[upgrade_name]["title"];
      document.getElementById(upgrade_name + "_upgrade_button").dataset.sub = upgrades[upgrade_name]["sub"];
      document.getElementById(upgrade_name + "_upgrade_name").textContent = upgrades[upgrade_name]["title"];
      document.getElementById(upgrade_name + "_upgrade_image").style.filter = "brightness(1)";
      const keys = Object.keys(upgrades);
      if (keys[keys.indexOf(upgrade_name) + 1])
        document.getElementById(keys[keys.indexOf(upgrade_name) + 1] + "_upgrade_button_div").style.display = "block";
      if (keys[keys.indexOf(upgrade_name) + 2])
        document.getElementById(keys[keys.indexOf(upgrade_name) + 2] + "_upgrade_button_div").style.display = "block";
    }

    upgrades_level[upgrade_name]["level"] ++;
    coins -= upgrades[upgrade_name]["cost"];
    upgrades[upgrade_name]["cost"] *= 1.12;　//あっぷぐれーどのコスト倍率

    document.getElementById("upgrade_sound").play();

    if (upgrades_level[upgrade_name]["level"] == upgrades_level[upgrade_name]["ascensions"] * 25 + 50) { //"Ascension!"を見せるだけ
      document.getElementById(upgrade_name + "_upgrade_button").style.display = "none";
      document.getElementById(upgrade_name + "_ascension_button").style.display = "block";
    } else { //"Ascension!"を消す、2個先まで見せる
      document.getElementById(upgrade_name + "_upgrade_button").style.display = "block";
      document.getElementById(upgrade_name + "_ascension_button").style.display = "none";
    }
  }
}

function ascension(upgrade_name) {
  upgrades_level[upgrade_name]["ascensions"] ++;
  upgrades_level[upgrade_name]["level"] = 0;
  upgrades[upgrade_name]["cost"] *= 1.12;　//ここだけ変えるのもあり
  document.getElementById(upgrade_name + "_upgrade_button").style.display = "block";
  document.getElementById(upgrade_name + "_ascension_button").style.display = "none";
}

const html_achievements = document.getElementById("achievements");

for (const achievement_name in achievements) { //実績のUIつくる
  const div = document.createElement("div");
  div.className = "achievement";
  div.id = achievement_name;
  div.dataset.title = "???"; //???
  div.dataset.desc = achievements[achievement_name][3];
  div.style.backgroundImage = `url("./images/achievements/${achievement_name}.png")`
  html_achievements.appendChild(div);
}

for (const achievement_name in achievements) {
  if (!achievements[achievement_name][0] && achievements[achievement_name][1]()) {
    achievements[achievement_name][0] = true;
    document.getElementById(achievement_name).dataset.title = achievements[achievement_name][2];
    document.getElementById(achievement_name).style.filter = "brightness(1)";
  }
}

let notice_queue = [];
let notice_db = false

const html_notice_div = document.getElementById("notice_div");
const html_notice_image = document.getElementById("notice_image");
const html_notice_title = document.getElementById("notice_title");
const html_notice_sub = document.getElementById("notice_sub");

function notice(img, title, sub) { //通知
  if (notice_db) { // 表示中
    notice_queue.push({"img": img, "title": title, "sub": sub});
  } else { // 非表示中
    notice_db = true;
    html_notice_div.style.display = "block";
    setTimeout(() => {
      html_notice_div.style.bottom = "1vh";
      html_notice_image.src = img;
      html_notice_title.textContent = title;
      html_notice_sub.textContent = sub;
      setTimeout(() => {
        html_notice_div.style.bottom = "-14vh";
        setTimeout(() => {
          notice_db = false;
          html_notice_div.style.display = "none";
          if (notice_queue[0]) {
            notice(notice_queue[0]["img"], notice_queue[0]["title"], notice_queue[0]["sub"]);
            notice_queue.shift()
          }
        }, 1000)
      }, 3000)
    }, 100)
  }
}

//tooltip
const tooltip = document.getElementById("tooltip");
const titleEl = tooltip.querySelector(".title");
const descEl = tooltip.querySelector(".desc");
const subEl = tooltip.querySelector(".sub");
const effectEl = tooltip.querySelector(".effect");
let target = null;

// マウス追従
document.addEventListener("mousemove", e => {
  tooltip.style.left = e.clientX + "px";
  tooltip.style.top = e.clientY + "px";
});

// ボタンごとのイベント
document.querySelectorAll("[data-title]").forEach(element => {
  element.addEventListener("mouseenter", () => {
    target = element;
  });

  element.addEventListener("mouseleave", () => {
    target = null;
  });
});


//tick
function tick() {
  coins_per_click = 1;
  coins_per_second = 0;
  ascensions = 0;

  for (const upgrade_name in upgrades) {
    if (upgrades[upgrade_name]["cost"] <= coins) {
      document.getElementById(upgrade_name + "_upgrade_cost").style.color = "#0D0";
    } else {
      document.getElementById(upgrade_name + "_upgrade_cost").style.color = "#D11";
    }

    document.getElementById(upgrade_name + "_upgrade_cost").innerHTML = '<img src="images/emojis/coin.png" alt="$" class="emoji">' + FormatNumber(upgrades[upgrade_name]["cost"], true, 3);
    document.getElementById(upgrade_name + "_upgrade_level").innerHTML = `${FormatNumber(upgrades_level[upgrade_name]["level"], false, 3)}<span style="font-size: 3vh;">/${upgrades_level[upgrade_name]["ascensions"] * 25 + 50}</span>`;
    document.getElementById(upgrade_name + "_ascension_level").innerHTML = `${upgrades_level[upgrade_name]["ascensions"] * 25 + 50}<span style="font-size: 3vh;">/${upgrades_level[upgrade_name]["ascensions"] * 25 + 50}</span>`;

    coins_per_click += upgrades[upgrade_name]["mpc"] * upgrades_level[upgrade_name]["level"];
    coins_per_second += upgrades[upgrade_name]["mps"] * upgrades_level[upgrade_name]["level"];
    ascensions += upgrades_level[upgrade_name]["ascensions"];
  }

  coins_per_click *= 1.5**ascensions;
  coins_per_second *= 1.5**ascensions;

  for (const achievement_name in achievements) {
    if (!achievements[achievement_name][0] && achievements[achievement_name][1]()) {
      achievements[achievement_name][0] = true;
      document.getElementById(achievement_name).dataset.title = achievements[achievement_name][2];
      document.getElementById(achievement_name).style.filter = "brightness(1)";
      notice(`images/achievements/${achievement_name}.png`, achievements[achievement_name][2], achievements[achievement_name][3]);
    }
  }

  // 存在するものだけ表示
  if (target) {
    titleEl.innerHTML = target.dataset.title || "";
    descEl.innerHTML = target.dataset.desc || "";
    subEl.innerHTML = target.dataset.sub || "";
    effectEl.innerHTML = target.dataset.effect || "";
    tooltip.style.display = "block";
  } else {
    tooltip.style.display = "none";
  }

  coins += coins_per_second / 20;
  coins_earned += coins_per_second / 20;

  html_coins.innerHTML = '<img src="images/emojis/coin.png" alt="$" class="emoji">' + FormatNumber(coins, true, 3);
  html_coins_per_click.innerHTML = 'per click: <img src="images/emojis/coin.png" alt="$" class="emoji">' + FormatNumber(coins_per_click, false, 3);
  html_coins_per_second.innerHTML = 'per second: <img src="images/emojis/coin.png" alt="$" class="emoji">' + FormatNumber(coins_per_second, false, 3);
  html_stats_coins.innerHTML = '<span class="stats_title">Coins: </span>' + FormatNumber(coins, false, 5);
  html_stats_coins_earned.innerHTML = '<span class="stats_title">Coins earned: </span>' + FormatNumber(coins_earned, false, 5);
  html_stats_coins_per_click.innerHTML = '<span class="stats_title">Coins per click: </span>' + FormatNumber(coins_per_click, false, 5);
  html_stats_coins_per_second.innerHTML = '<span class="stats_title">Coins per second: </span>' + FormatNumber(coins_per_second, false, 5);
  html_stats_button_clicked.innerHTML = '<span class="stats_title">Button clicked: </span>' + clicks.toLocaleString();
}

setInterval(tick, 50);

function save() {
  let new_save_data = {
    "coins": coins,
    "coins_earned": coins_earned,
    "clicks": clicks,
    "upgrades_level": upgrades_level,
  };
  localStorage.setItem("save_data", JSON.stringify(new_save_data));
  console.log("data saved!")
}

setInterval(save, 30000)


function reset_data() {
  var result = confirm("Are you sure want to reset data?? 本当にデータをリセットしても大丈夫?");
  if (result) {
    var result = confirm("Are you sure??? 本当に??");
    if (result) {
      localStorage.clear();
      location.reload();
    }
  }
}

const button = document.getElementById("reset_button");
const bar = document.getElementById("reset_progress_bar");
let interval;

button.addEventListener("mousedown", startHold);
button.addEventListener("touchstart", startHold);
button.addEventListener("mouseup", stopHold);
button.addEventListener("mouseleave", stopHold);
button.addEventListener("touchend", stopHold);
button.addEventListener("touchcancel", stopHold);

function startHold() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (bar.value < bar.max) bar.value += .5; // 押してる間は増える
    else {
      bar.value = bar.max;
      reset_data();
      clearInterval(interval);
    }
  }, 30);
}

function stopHold() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (bar.value > 0) bar.value -= 5; // 離すと減る
    else {
      bar.value = 0;
      clearInterval(interval);
    }
  }, 30);
}
