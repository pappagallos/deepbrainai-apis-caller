const axios = require('../utils/axiosInstance');
const { v4: uuidv4 } = require('uuid');
const env = require('dotenv');

env.config();

const generateClientToken = async () => {
    try {
        const { data } = await axios.get(`generateClientToken?appId=${process.env.DEEPBRAINAI_API_APP_ID}&userKey=${process.env.DEEPBRAINAI_API_USER_KEY}`);

        return data;
    } catch (error) {
        throw new Error(error);
    }
}

const getModelList = async (appId, token) => {
    try {
        const body = {
            appId,                      // 발급받은 appId
            platform: 'web',            // 플랫폼, 고정 값
            isClientToken: true,        // 인증 방식이 ClientToken 방식인지 여부
            token,                      // 토큰
            uuid: uuidv4(),             // 요청 고유 아이디
            sdk_v: '1.0',               // SDK 버전 명시
            clientHostname: appId       // 호스트명, appId 와 동일
        }

        const { data } = await axios.post('getModelList', body);

        return data;
    } catch (error) {
        throw new Error(error);
    }
}

const getModelInfo = async (appId, token, model) => {
    try {
        const body = {
            appId,                      // 발급받은 appId
            platform: 'web',            // 플랫폼, 고정 값
            isClientToken: true,        // 인증 방식이 ClientToken 방식인지 여부
            token,                      // 토큰
            uuid: uuidv4(),             // 요청 고유 아이디
            sdk_v: '1.0',               // SDK 버전 명시
            clientHostname: appId,      // 호스트명, appId 와 동일
            model                       // 모델 식별 아이디
        }

        const { data } = await axios.post('getModelInfo', body);

        return data;
    } catch (error) {
        throw new Error(error);
    }
}

const makeVideo = async (appId, token, text, model) => {
    try {
        const body = {
            appId,                      // 발급받은 appId
            platform: 'web',            // 플랫폼, 고정 값
            isClientToken: true,        // 인증 방식이 ClientToken 방식인지 여부
            token,                      // 토큰
            uuid: uuidv4(),             // 요청 고유 아이디
            sdk_v: '1.0',               // SDK 버전 명시
            clientHostname: appId,      // 호스트명, appId 와 동일
            language: 'ko',             // AI 사용 언어
            text,                       // AI 영상으로 변환할 텍스트
            model                       // 모델 식별 아이디
        }

        const { data } = await axios.post('makeVideo', body);

        return data.data;
    } catch (error) {
        throw new Error(error);
    }
}

const findProject = async (appId, token, key) => {
    try {
        const body = {
            appId,                      // 발급받은 appId
            platform: 'web',            // 플랫폼, 고정 값
            isClientToken: true,        // 인증 방식이 ClientToken 방식인지 여부
            token,                      // 토큰
            uuid: uuidv4(),             // 요청 고유 아이디
            sdk_v: '1.0',               // SDK 버전 명시
            clientHostname: appId,      // 호스트명, appId 와 동일
            key                         // 발급받은 프로젝트 식별 아이디
        }

        const { data } = await axios.post('findProject', body);

        return data;
    } catch (error) {
        throw new Error(error);
    }
}

const asyncFindProject = async (appId, token, key, socket) => {
    // 비동기 처리를 위해 Promise 로 return
    return new Promise((resolve, reject) => {
        try {
            // .5초 마다 API 를 호출하여 동영상 변환 상태를 소켓으로 전달
            const interval = setInterval(async () => {
                const project = await findProject(appId, token, key);
                console.log(`[Converting/${key}] ${project.data.progress}`);

                if (project && project.data.progress === 100) {
                    // 가끔 project.data.video 가 undefined 로 넘어오는 경우가 있어 한 번 더 체크
                    if (project.data.video) {
                        console.log(`[Successfully Converted/${key}] ${JSON.stringify(project.data)}`);
                        clearInterval(interval);
                        resolve(project.data);
                    }
                } else {
                    socket.emit('progress', [project]);
                }
            }, 500);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateClientToken,
    getModelList,
    getModelInfo,
    makeVideo,
    findProject,
    asyncFindProject
}