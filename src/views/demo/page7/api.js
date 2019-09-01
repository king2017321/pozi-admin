import request from '@/plugin/axios'
let basurl=process.env.NODE_ENV=="development"?'/wx':"https://api.weixin.qq.com"
export const getActive=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=active`,
        method:'POST',
        data:{}
    })
}
export const addActive=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addActive`,
        method:'POST',
        data
    })
}
export const updateActive=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateActive`,
        method:'POST',
        data
    })
}
export const deleteActive=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=deleteActive`,
        method:'POST',
        data
    })
}
export const getUploadPath=(data)=>{
    return request({
        url:`${basurl}/tcb/uploadfile?access_token=${data.token}`,
        method:'POST',
        data:{
            env:'fayuandi-v1',
            path:data.path
        }
    })
}
export const getImgUrl=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=getImgUrl`,
        method:'POST',
        data:{
            fileList:data.fileList
        }
    })
}