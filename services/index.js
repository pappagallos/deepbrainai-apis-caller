// const axios = require('../utils/axiosInstance');
const { 
    generateClientToken,
    getModelList,
    getModelInfo,
    makeVideo,
    findProject,
    asyncFindProject
} = require('../apis');

const fetchVideo = async (text, socket) => {
    try {
        const { appId, token } = await generateClientToken();
        // const { models } = await getModelList(appId, token);
        // const { model } = await getModelInfo(appId, token, 'ysy');
        const video = await makeVideo(appId, token, text, 'ysy');
        const result = await asyncFindProject(appId, token, video.data.key, socket);
        
        console.log(JSON.stringify(result));

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = {
    fetchVideo
}