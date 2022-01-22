const { 
    generateClientToken,
    getModelList,
    getModelInfo,
    makeVideo,
    findProject,
    asyncFindProject
} = require('../apis');

const fetchVideo = async (callNumber, name, counterNumber, socket) => {
    try {
        const convertedName = name.split('');
        convertedName.splice(1, 0, ',');
        convertedName.join('');

        const { appId, token } = await generateClientToken();
        const { key } = await makeVideo(appId, token, `${callNumber}번, ${convertedName}님! ${counterNumber}번, 창구로, 이동해 주시기 바랍니다.`, 'ysy');
        const { video } = await asyncFindProject(appId, token, key, socket);
        
        return { callNumber, counterNumber, name, video };

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    fetchVideo
} 