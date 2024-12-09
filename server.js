const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Cross-Origin Isolation 설정
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// 정적 파일 제공 (현재 디렉토리에서 파일 제공)
app.use(express.static(path.join(__dirname)));

// 기본 경로로 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Main.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
