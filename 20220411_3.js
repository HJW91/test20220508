// let total = parseInt(prompt('카드 개수를 짝수로 입력하세요(최대 20)',10));
let total;

// const colors = [
//   'red','orange','yellow','green','white',
//   'pink','cyan','violet','gray','black'
// ];

// HTML4 표준색상(16개)
const colors = [
  'aqua', 'blue', 'gray', 'lime', 'navy', 'purple', 'silver', 'white',
  'black', 'fuchsia', 'green', 'maroon', 'olive', 'red', 'teal', 'yellow'
];
let $wrapper = document.querySelector('#wrapper');
let $btnStart = document.querySelector('#btnStart');
// let $rdoColorNum = document.querySelector('input[type=radio]:checked')
let $cardNum = document.querySelector('#cardNum');
let colorSlice;
let colorCopy; // 카드 색상 값(최종)
let shuffled = []; // 랜덤하게 섞은 카드색상값
let completed = []; // 올바르게 찾은 카드
let clicked = []; // 클릭한 카드. 최대 2개만 존재함
let startTime; // 게임 시작 시간
let clickable = false;
let groupSize; // 카드 짝의 갯수
let finalCardSize;  // 최종 카드 갯수

// 색상을 랜덤하게 섞는 함수
function shuffle() {
  // colorSlice = colors.slice(0, total / groupSize);
  let tmpColors = [];
  for(let i=0; i<colors.length; i++){
    tmpColors.push(colors[i]);
  }
  colorSlice = [];

  // for(let i=0; i<parseInt(total/groupSize); i++){
  for(let i=0; i<finalCardSize/groupSize; i++){
    let randomIndex = Math.floor(Math.random() * tmpColors.length);
    colorSlice = colorSlice.concat(tmpColors.splice(randomIndex,1));
    // console.log(`i : ${i}`);
  }
  // console.log(`colroSlice : ${colorSlice}`)
  
  let colorCopy = [];
  for (let i = 0; i < groupSize; i++) {
    colorCopy = colorCopy.concat(colorSlice);
  }
  // console.log(`colorCopy : ${colorCopy}`)

  shuffled = [];
  for (let i = 0; 0 < colorCopy.length; i++) {
    let randomIndex = Math.floor(Math.random() * colorCopy.length);
    shuffled = shuffled.concat(colorCopy.splice(randomIndex, 1))
  }
  // console.log(`shuffled : ${shuffled}`)
}

// 카드를 생성
function createCard(i) {
  const card = document.createElement('div');
  card.className = 'card';
  const cardInner = document.createElement('div')
  cardInner.className = 'card-inner';
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front'
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back'
  cardBack.style.backgroundColor = shuffled[i];
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  return card;
}

// 클릭 시 동작
function onClickCard() {
  let isExist = false;
  for (let i = 0; i < clicked.length; i++) {
    if (clicked[i] === this) {
      isExist = true;
    }
  }
  if (!clickable || completed.includes(this) || isExist) {
    return;
  }
  this.classList.toggle('flipped');
  clicked.push(this);

  // 현재까지 클릭했던 카드들의 색상들이 같은지를 체크함
  const firstBackColor = clicked[0].querySelector('.card-back').style.backgroundColor;
  let isSameColor = true;
  for (let i = 1; i < clicked.length; i++) {
    // console.log(`0. isSameColor : ${isSameColor}`)
    let otherBackColor = clicked[i].querySelector('.card-back').style.backgroundColor;
    if (firstBackColor !== otherBackColor) {
      isSameColor = false;
    }
  }


  if (!isSameColor) { // 다른 색상인 경우 초기화
    // console.log(`1. isSameColor : ${isSameColor}`)
    clickable = false;
    setTimeout(function () {
      for (let i = 0; i < clicked.length; i++) {
        clicked[i].classList.remove('flipped');
      }
      clicked = [];
      clickable = true;
    }, 1000);
  } else if (clicked.length === groupSize && isSameColor) { // 같은 색상을 모두 찾았을 때
    // console.log(`2. isSameColor : ${isSameColor}`)
    for (let i = 0; i < clicked.length; i++) {
      completed.push(clicked[i]);
    }
    clicked = [];
    if (completed.length !== finalCardSize) { // 아직은 남은 색상이 있다면 계속 진행함
      return;
    }
    const endTime = new Date();
    // console.log(`step0`);
    setTimeout(function () {
      // console.log(`step1`);
      alert(`축하합니다! ${(endTime-startTime)/1000}초 걸렸습니다.`)
      // console.log(`step1-1`);
    }, 1000)
    // console.log(`step2`);
    clickable = false;
    setTimeout(function () {
      for (let i = 0; i < clicked.length; i++) {
        clicked[i].classList.remove('flipped');
      }
      clicked = [];
      completed = [];
      clickable = true;
    }, 1000);
  }
}

// 게임 시작
function startGame() {
  $btnStart.disabled = true;
  $wrapper.innerHTML = null;
  total = parseInt($cardNum.value);
  groupSize = parseInt(document.querySelector('input[type=radio]:checked').value);
  finalCardSize = Math.round(total/groupSize) * groupSize;
  // console.log(`parseInt(total/groupSize) : ${parseInt(total/groupSize)}`)
  // console.log(`Math.round(total/groupSize) : ${Math.round(total/groupSize)}`)
  // console.log(`finalCardSize : ${finalCardSize}`)
  shuffle();
  for (let i = 0; i < finalCardSize; i++) {
    const card = createCard(i);
    card.addEventListener('click', onClickCard);
    $wrapper.appendChild(card);
  }
  // console.log(`$wrapper : ${$wrapper.length}`)

  // 초반 카드 공개
  document.querySelectorAll('.card').forEach(function (card, index) {
    setTimeout(function () {
      card.classList.add('flipped');
    }, 1000 + 100 * index)
  })

  // 카드 감추기
  setTimeout(function () {
    document.querySelectorAll('.card').forEach(function (card, index) {
      card.classList.remove('flipped');
      startTime = new Date();
      clickable = true;
      $btnStart.disabled = false;
    })
  }, 5000)
}
// startGame();
$btnStart.addEventListener('click', startGame, true);