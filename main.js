let money = 0;
let money_per_click = 1;
let money_per_second = 0;
let money_earned = 0;
let ascensions = 0;

const suffixes = [
"", "", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
"Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
"Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg",
"Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg",
"Qag", "Uqag", "Dqag", "Tqag", "Qaqag", "Qiqag", "Sxqag", "Spqag", "Ocqag", "Noqag",
"Qig", "Uqig", "Dqig", "Tqig", "Qaqig", "Qiqig", "Sxqig", "Spqig", "Ocqig", "Noqig",

]

function FormatNumber(num, floor) { //12,345,678
  let digits = Math.floor(Math.log10(num));  //7
  let index = Math.floor(digits / 3);        //2

  if (index >= 2) {
    return (Math.floor(num / 10**(digits - 2)) / 10**(2 - (digits - index * 3))) + suffixes[index]; //12.3 + "M"
  } else if (digits < 3 && !floor) {
    return Math.floor(num * 10) / 10;
  } else {
    return Math.floor(num).toLocaleString();
  }
}

const html_money = document.getElementById("money");
const html_money_per_click = document.getElementById("money_per_click");
const html_money_per_second = document.getElementById("money_per_second");

const html_power_line = document.getElementById("power_line");

function money_button_clicked() {
  money += money_per_click;
  money_earned += money_per_click;
  html_money.textContent = "$" + FormatNumber(Math.floor(money), true);


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
};

let upgrades = {
  // 0: title, 1: sub, 2: effect, 3: level, 4: cost, 5:ascensions 6: +mpc, 7: +mps
  "cursor_I": ["Cursor I", "More clicks!", "", 0, 20, 0, 0.5, 0],
  "finger": ["Finger", "First auto click", "", 0, 250, 0, 0, 3],
  "cursor_II": ["Cursor II", "Golden!", "", 0, 1500, 0, 15, 0],
  "hydropower": ["Hydropower", "The power of water", "", 0, 8000, 0, 0, 80],
  "pyropower": ["Pyropower", "Fire!!!", "", 0, 50000, 0, 0, 400],
  "cursor_III": ["Cursor III", "Shiny emerald", "", 0, 100000, 0, 750, 0],
  "solarpower": ["Solarpower", "Massive solar panels", "", 0, 600000, 0, 0, 4500],
};

for (const upgrade_name in upgrades) {
    let effect = "";
    if (upgrades[upgrade_name][6] != 0) {
      if (effect != "") effect += "<br>";
      effect += "money/click +" + FormatNumber(upgrades[upgrade_name][6], false);
    }
    if (upgrades[upgrade_name][7] != 0) {
      if (effect != "") effect += "<br>";
      effect += "money/sec +" + FormatNumber(upgrades[upgrade_name][7], false);
    }
    upgrades[upgrade_name][2] = effect
}

const html_upgrades_div = document.getElementById("upgrades_div");
const html_upgrade_button_div_template = document.getElementById("upgrade_button_div_template");

//create upgrade buttons
for (const upgrade_name in upgrades) {
  const upgrade_button_div = html_upgrade_button_div_template.content.querySelector(".upgrade_button_div").cloneNode(true);
  html_upgrades_div.appendChild(upgrade_button_div);
  upgrade_button_div.id = upgrade_name + "_button_div"
  if (upgrade_name == "cursor_I" || upgrade_name == "finger" ) upgrade_button_div.style.display = "block";

  const upgrade_button = upgrade_button_div.querySelector(".upgrade_button");
  upgrade_button.onclick = () => upgrade(upgrade_name);
  upgrade_button.id = upgrade_name + "_button";
  upgrade_button.dataset.effect = upgrades[upgrade_name][2];

  const upgrade_button_text = upgrade_button.querySelector(".upgrade_button_text");

  upgrade_button_text.querySelector(".upgrade_image").src = `images/upgrades/${upgrade_name}.png`;
  upgrade_button_text.querySelector(".upgrade_image").id = upgrade_name + "_image"
  upgrade_button_text.querySelector(".upgrade_name").id = upgrade_name + "_name";
  upgrade_button_text.querySelector(".upgrade_cost").id = upgrade_name + "_cost";
  upgrade_button_text.querySelector(".upgrade_level").id = upgrade_name + "_level";
  upgrade_button_text.querySelector(".upgrade_ascension").id = upgrade_name + "_ascension";
}

//upgrade
function upgrade(upgrade_name) {
  if (upgrades[upgrade_name][3] == upgrades[upgrade_name][5] * 25 + 50) { //ascension
    upgrades[upgrade_name][5] ++;
    upgrades[upgrade_name][3] = 0;
    upgrades[upgrade_name][4] *= 1.125;

    document.getElementById(upgrade_name + "_name").style.display = "block";
    document.getElementById(upgrade_name + "_cost").style.display = "block";
    document.getElementById(upgrade_name + "_ascension").style.display = "none";
    document.getElementById(upgrade_name + "_button").dataset.title = upgrades[upgrade_name][0];
    document.getElementById(upgrade_name + "_button").dataset.sub = upgrades[upgrade_name][1];
    document.getElementById(upgrade_name + "_button").dataset.effect = upgrades[upgrade_name][2];
  } else {
    if (upgrades[upgrade_name][4] <= money) {
      upgrades[upgrade_name][3] ++;
      money -= upgrades[upgrade_name][4];
      upgrades[upgrade_name][4] *= 1.125;

      document.getElementById("upgrade_sound").play();

      if (upgrades[upgrade_name][3] == upgrades[upgrade_name][5] * 25 + 50) { //show "Ascension!"
        document.getElementById(upgrade_name + "_name").style.display = "none";
        document.getElementById(upgrade_name + "_cost").style.display = "none";
        document.getElementById(upgrade_name + "_ascension").style.display = "block";
        document.getElementById(upgrade_name + "_button").dataset.title = "Ascension";
        document.getElementById(upgrade_name + "_button").dataset.sub = "Reset for money";
        document.getElementById(upgrade_name + "_button").dataset.effect = "level => 0<br>money per click *1.5<br>money per second *1.5"
      } else { //hide "Ascension!"
        const keys = Object.keys(upgrades);
        document.getElementById(upgrade_name + "_name").textContent = upgrades[upgrade_name][0];
        document.getElementById(upgrade_name + "_image").style.filter = "brightness(1)";
        if (keys[keys.indexOf(upgrade_name) + 1])
          document.getElementById(keys[keys.indexOf(upgrade_name) + 1] + "_button_div").style.display = "block";
        if (keys[keys.indexOf(upgrade_name) + 2])
          document.getElementById(keys[keys.indexOf(upgrade_name) + 2] + "_button_div").style.display = "block";
        document.getElementById(upgrade_name + "_button").dataset.title = upgrades[upgrade_name][0];
        document.getElementById(upgrade_name + "_button").dataset.sub = upgrades[upgrade_name][1];
        document.getElementById(upgrade_name + "_button").dataset.effect = upgrades[upgrade_name][2];
      }
    }
  }
}

// achievements
let achievements_div = false;
const html_achievements_div = document.getElementById("achievements_div");

function open_achievements() {
  achievements_div = !achievements_div;
  if (achievements_div) {
    html_achievements_div.style.left = "30vh";
  } else {
    html_achievements_div.style.left = "-25svh";
  }
}

const html_achievements = document.getElementById("achievements");

let achievements = {
  // 0: unlocked, 1: , 2: title, 3: desc
  "1_dollar": [false, () => (money_earned >= 1), "First Step", "Earn 1 dollar"],
  "1k_dollars": [false, () => (money_earned >= 10**3),"Tiny Rich", "Earn 1k dollars"],
  "1M_dollars": [false, () => (money_earned >= 10**6),"Mega Bucks", "Earn 1M dollars"],
};

//Star Buyer
//Galaxy Cash
//Cosmic King
//Infinite Rich
//Multiverse Cash

//create achievement divs
for (const achievement_name in achievements) {
  const div = document.createElement("div");
  div.className = "achievement";
  div.id = achievement_name;
  div.dataset.title = "???";
  div.dataset.desc = achievements[achievement_name][3];
  div.style.backgroundImage = `url(\"./images/achievements/${achievement_name}.png\")`
  html_achievements.appendChild(div);
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
  money_per_click = 1;
  money_per_second = 0;
  ascensions = 0;

  for (const upgrade_name in upgrades) {
    if (upgrades[upgrade_name][4] <= money) {
      document.getElementById(upgrade_name + "_cost").style.color = "#0D0";
    } else {
      document.getElementById(upgrade_name + "_cost").style.color = "#D11";
    }

    document.getElementById(upgrade_name + "_cost").textContent = "$" + FormatNumber(upgrades[upgrade_name][4], true);
    document.getElementById(upgrade_name + "_level").innerHTML = `${FormatNumber(upgrades[upgrade_name][3], false)}<span style="font-size: 3vh;">/${upgrades[upgrade_name][5] * 25 + 50}</span>`;

    money_per_click += upgrades[upgrade_name][6] * upgrades[upgrade_name][3];
    money_per_second += upgrades[upgrade_name][7] * upgrades[upgrade_name][3];
    ascensions += upgrades[upgrade_name][5];
  }

  money_per_click *= 1.5**ascensions;
  money_per_second *= 1.5**ascensions;

  for (const achievement_name in achievements) {
    if (achievements[achievement_name][1]()) {
      achievements[achievement_name][0] = true;
      document.getElementById(achievement_name).dataset.title = achievements[achievement_name][2];
      document.getElementById(achievement_name).style.filter = "brightness(1)";
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

  money += money_per_second / 20;
  money_earned += money_per_second / 20;

  html_money.textContent = "$" + FormatNumber(money, true);
  html_money_per_click.textContent = "per click: $" + FormatNumber(money_per_click, false);
  html_money_per_second.textContent = "per second: $" + FormatNumber(money_per_second, false);
}

setInterval(tick, 50);
