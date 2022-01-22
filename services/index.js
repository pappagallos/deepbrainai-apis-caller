const { 
    generateClientToken,
    getModelList,
    getModelInfo,
    makeVideo,
    findProject,
    asyncFindProject
} = require('../apis');

const fetchVideo = async (name, counterNumber, socket) => {
    try {
        const { appId, token } = await generateClientToken();
        const { key } = await makeVideo(appId, token, `${name}님! ${counterNumber}번, 창구로, 이동해 주시기 바랍니다.`, 'ysy');
        const { video } = await asyncFindProject(appId, token, key, socket);
        
        return { counterNumber, name, video };

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    fetchVideo
} 