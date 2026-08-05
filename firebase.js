import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCHA-K8PPPA6NceOtu3si-XV0UkB85NlzQ',
  authDomain: 'busanharborcrain.firebaseapp.com',
  projectId: 'busanharborcrain',
  storageBucket: 'busanharborcrain.firebasestorage.app',
  messagingSenderId: '728235581448',
  appId: '1:728235581448:web:0e6c6855f75e237d6ef1bd',
  measurementId: 'G-KFLC46GJBN'
};

const db = getFirestore(initializeApp(firebaseConfig));
const safetyDoc = doc(db, 'safety', 'currentTyphoon');
const $ = id => document.getElementById(id);
const grade = wind => wind >= 44 ? '위험' : wind >= 33 ? '주의' : wind >= 17 ? '관심' : '정상';

function render(data, label = 'Firebase 동기화됨') {
  const forecastLevel = grade(Number(data.forecastWind));
  $('current').textContent = Number(data.currentWind).toFixed(1);
  $('forecast').textContent = `${Number(data.forecastWind).toFixed(1)} m/s`;
  $('level').textContent = forecastLevel;
  $('badge').textContent = `${forecastLevel} · ${forecastLevel === '위험' ? '작업 중지' : '상황 관찰'}`;
  $('badge').style.background = forecastLevel === '위험' ? '#e8465d' : forecastLevel === '주의' ? '#e28725' : '#c58b12';
  $('message').textContent = forecastLevel === '위험'
    ? '1시간 후 부산항 풍속이 위험 수준으로 예상됩니다. 크레인 작업을 즉시 중지하고 안전관리자의 지시에 따라주세요.'
    : '1시간 후 예상 풍속은 위험 기준 미만입니다. 기상 변화와 장비 상태를 계속 확인하세요.';
  $('source').textContent = label;
}

onSnapshot(safetyDoc, snapshot => {
  if (snapshot.exists()) render(snapshot.data());
}, error => { $('source').textContent = `Firebase 연결 대기: ${error.code}`; });

$('save-demo').addEventListener('click', async () => {
  try {
    await setDoc(safetyDoc, { typhoonName:'한울', currentWind:31.8, forecastWind:46.2, approachHours:2, updatedAt:serverTimestamp() }, { merge:true });
    $('source').textContent = 'Firebase에 시연 데이터가 등록되었습니다.';
  } catch (error) { $('source').textContent = `Firebase 등록 실패: ${error.code}`; }
});
