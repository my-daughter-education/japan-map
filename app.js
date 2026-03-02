const prefectures = [
  { id:"hokkaido", name:"北海道", capital:"札幌市" },
  { id:"aomori", name:"青森県", capital:"青森市" },
  { id:"iwate", name:"岩手県", capital:"盛岡市" },
  { id:"miyagi", name:"宮城県", capital:"仙台市" },
  { id:"akita", name:"秋田県", capital:"秋田市" },
  { id:"yamagata", name:"山形県", capital:"山形市" },
  { id:"fukushima", name:"福島県", capital:"福島市" },
  { id:"ibaraki", name:"茨城県", capital:"水戸市" },
  { id:"tochigi", name:"栃木県", capital:"宇都宮市" },
  { id:"gunma", name:"群馬県", capital:"前橋市" },
  { id:"saitama", name:"埼玉県", capital:"さいたま市" },
  { id:"chiba", name:"千葉県", capital:"千葉市" },
  { id:"tokyo", name:"東京都", capital:"東京" },
  { id:"kanagawa", name:"神奈川県", capital:"横浜市" },
  { id:"niigata", name:"新潟県", capital:"新潟市" },
  { id:"toyama", name:"富山県", capital:"富山市" },
  { id:"ishikawa", name:"石川県", capital:"金沢市" },
  { id:"fukui", name:"福井県", capital:"福井市" },
  { id:"yamanashi", name:"山梨県", capital:"甲府市" },
  { id:"nagano", name:"長野県", capital:"長野市" },
  { id:"gifu", name:"岐阜県", capital:"岐阜市" },
  { id:"shizuoka", name:"静岡県", capital:"静岡市" },
  { id:"aichi", name:"愛知県", capital:"名古屋市" },
  { id:"mie", name:"三重県", capital:"津市" },
  { id:"shiga", name:"滋賀県", capital:"大津市" },
  { id:"kyoto", name:"京都府", capital:"京都市" },
  { id:"osaka", name:"大阪府", capital:"大阪市" },
  { id:"hyogo", name:"兵庫県", capital:"神戸市" },
  { id:"nara", name:"奈良県", capital:"奈良市" },
  { id:"wakayama", name:"和歌山県", capital:"和歌山市" },
  { id:"tottori", name:"鳥取県", capital:"鳥取市" },
  { id:"shimane", name:"島根県", capital:"松江市" },
  { id:"okayama", name:"岡山県", capital:"岡山市" },
  { id:"hiroshima", name:"広島県", capital:"広島市" },
  { id:"yamaguchi", name:"山口県", capital:"山口市" },
  { id:"tokushima", name:"徳島県", capital:"徳島市" },
  { id:"kagawa", name:"香川県", capital:"高松市" },
  { id:"ehime", name:"愛媛県", capital:"松山市" },
  { id:"kochi", name:"高知県", capital:"高知市" },
  { id:"fukuoka", name:"福岡県", capital:"福岡市" },
  { id:"saga", name:"佐賀県", capital:"佐賀市" },
  { id:"nagasaki", name:"長崎県", capital:"長崎市" },
  { id:"kumamoto", name:"熊本県", capital:"熊本市" },
  { id:"oita", name:"大分県", capital:"大分市" },
  { id:"miyazaki", name:"宮崎県", capital:"宮崎市" },
  { id:"kagoshima", name:"鹿児島県", capital:"鹿児島市" },
  { id:"okinawa", name:"沖縄県", capital:"那覇市" }
];

let remaining = [];
let current = null;
let startTime = 0;
let mode = "pref";
let timerInterval = null;
let gameActive = false;
let missCount = 0;

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".prefecture").forEach(el => {

    const classes = Array.from(el.classList);
    const prefId = classes.find(c =>
      prefectures.some(p => p.id === c)
    );

    if(prefId){
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        if(gameActive){
          handleClick(prefId, el);
        }
      });
    }
  });

  document.getElementById("startBtn")
    .addEventListener("click", startGame);

  updateBestDisplay();
});

function setMode(selected){
  mode = selected;
  updateBestDisplay();
}

function startGame(){

  remaining = [...prefectures];
  gameActive = true;
  missCount = 0;
  
document.getElementById("rank").textContent = "";

document.querySelectorAll(".prefecture").forEach(el=>{
    el.style.fill = "#e0e0e0";
  });

  startTime = Date.now();

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 50);

  nextQuestion();
}

function updateTimer(){
  const time = ((Date.now() - startTime)/1000).toFixed(2);
  document.getElementById("timer").textContent =
    "Time: " + time + " 秒";
}

function updateBestDisplay(){
  const key = mode === "pref"
    ? "bestTimePref"
    : "bestTimeCapital";

  const best = localStorage.getItem(key);
  document.getElementById("best").textContent =
    "Best: " + (best ? best : "--") + " 秒";
}

function nextQuestion(){
  if(remaining.length === 0){
    endGame();
    return;
  }

  current = remaining[Math.floor(Math.random()*remaining.length)];

  document.getElementById("question").textContent =
    mode === "pref"
    ? current.name + " をクリック！"
    : current.capital + " がある都道府県は？";
}

function handleClick(prefId, el){

  if(prefId === current.id){
    el.style.fill = "#4caf50";
    remaining = remaining.filter(p => p.id !== prefId);
    nextQuestion();
  }else{
    missCount++;
    el.style.fill = "#f44336";
    setTimeout(()=>{
      el.style.fill = "#e0e0e0";
    }, 500);
  }
}

function endGame(){

  clearInterval(timerInterval);
  gameActive = false;

  const time = ((Date.now() - startTime)/1000).toFixed(2);

  const key = mode === "pref"
    ? "bestTimePref"
    : "bestTimeCapital";

  const best = localStorage.getItem(key);

  if(!best || time < best){
    localStorage.setItem(key, time);
    alert("🎉 新記録！ " + time + "秒");
  }else{
    alert("クリア！ " + time + "秒");
  }

  updateBestDisplay();
  showRank(time);
}

function showRank(time){

  const t = parseFloat(time);
  let rank = "C";

  if(t <= 75 && missCount === 0){
    rank = "神";
  }else if(t < 120 && missCount === 0){
    rank = "SSS";
  }else if(t < 150 && missCount <= 2){
    rank = "SS";
  }else if(t < 180 && missCount <= 5){
    rank = "S";
  }else if(t < 240){
    rank = "A";
  }else if(t < 300){
    rank = "B";
  }

  const rankEl = document.getElementById("rank");

  // ← ここを完全リセット方式にする
  rankEl.setAttribute("class", "rank-" + rank);

  rankEl.innerHTML =
    "ランク: " + rank +
    "<br>タイム: " + t + "秒 / ミス: " + missCount;

}
