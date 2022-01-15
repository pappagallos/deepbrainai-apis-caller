const { 
    generateClientToken,
    getModelList,
    getModelInfo,
    makeVideo,
    findProject,
    asyncFindProject
} = require('../apis');

const fetchVideo = async (name, number, socket) => {
    try {
        const convertedName = name.split('');
        convertedName.splice(1, 0, ',');
        convertedName.join('');

        const { appId, token } = await generateClientToken();
        const { key } = await makeVideo(appId, token, `${convertedName}님! ${number}번, 창구로, 이동해 주시기 바랍니다.`, 'ysy');
        const { video } = await asyncFindProject(appId, token, key, socket);
        
        return { number, name, video_url: video };

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    fetchVideo
} 